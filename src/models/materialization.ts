import {
  areMatch,
  EntityChange,
  EntityRef,
  isEntityRef,
  PropertyChange
} from "./changeSets"
import { AllProperties, EntitySchema, getSchema } from "./entities"

export type NonNullFieldValue =
  | string
  | number
  | MaterializedEntity
  | MaterializedEntity[]

export type FieldValue = NonNullFieldValue | null

export type EntityData = Record<string, FieldValue>

export interface MaterializedEntity {
  entityRef: EntityRef
  data: EntityData
  state: "original" | "new" | "modified" | "deleted"
}

export const isMaterializedEntity = (f: FieldValue): f is MaterializedEntity =>
  f !== null &&
  typeof f === "object" &&
  typeof (f as MaterializedEntity).data === "object"

export const isMaterializedEntityArray = (
  f: FieldValue
): f is MaterializedEntity[] => Array.isArray(f)

export const materializeNew = (
  schema: EntitySchema,
  id: string | number
): MaterializedEntity => {
  const data: EntityData = {}
  for (const p of schema.properties) {
    if (
      (p.kind === "number" || p.kind === "text") &&
      p.backingField === schema.pkField
    ) {
      data[p.label] = id
    } else if (p.kind === "number") {
      data[p.label] = p.notNull ? 0 : null
    } else if (p.kind === "text") {
      data[p.label] = p.nullable ? null : ""
    } else if (p.kind === "entityList") {
      data[p.label] = []
    } else if (p.kind === "entityValue") {
      data[p.label] = p.notNull
        ? materializeNew(getSchema(p.linkedEntitySchema), `${id}_${p.label}`)
        : null
    } else if (p.kind === "table") {
      for (let i = 0; i < p.rows.length; ++i) {
        for (let j = 0; j < p.columns.length; ++j) {
          data[p.cellField(j, i)] = null
        }
      }
    }
  }
  return {
    entityRef: { id, schema: schema.name, type: "new" },
    state: "new",
    data
  }
}

/**
 * This type indexes materialized entities according to their schema and id. It
 * can be used to represent an entire entity graph
 */
export type MaterializedData = {
  [schemaName: string]: { [id: string]: MaterializedEntity }
}

export const addToMaterializedData = (
  data: MaterializedData,
  entity: MaterializedEntity
) => {
  const group = (data[entity.entityRef.schema] ??= {})
  group[entity.entityRef.id] = entity
  return data
}

/**
 * Create a deep clone of the entity.
 */
export const cloneEntity = (entity: MaterializedEntity) => {
  const recursive = ({
    entityRef,
    state,
    data
  }: MaterializedEntity): MaterializedEntity => {
    const next = Object.entries(data).reduce<EntityData>(
      (agg, [key, value]) => ({
        ...agg,
        [key]: isMaterializedEntity(value)
          ? cloneEntity(value)
          : isMaterializedEntityArray(value)
          ? value.map(cloneEntity)
          : value
      }),
      {}
    )
    return { entityRef: { ...entityRef }, state, data: next }
  }
  return recursive(entity)
}

export const expandMaterialized = (
  root: MaterializedEntity
): MaterializedData => {
  const expanded: MaterializedData = {}
  const recurse = (e: MaterializedEntity) => {
    addToMaterializedData(expanded, e)
    const children = Object.values(e.data).flatMap((f) =>
      isMaterializedEntityArray(f) || isMaterializedEntity(f) ? f : []
    )
    for (const c of children) {
      recurse(c)
    }
  }
  recurse(root)
  return expanded
}

export const getEntity = (
  data: MaterializedData,
  entityRef: EntityRef
): MaterializedEntity => {
  const grp = data[entityRef.schema] ?? {}
  let match = grp[entityRef.id]
  if (!match) {
    if (entityRef.type === "new") {
      // Materialize new entity and add it to data.
      match = materializeNew(getSchema(entityRef.schema), entityRef.id)
      addToMaterializedData(data, match)
    } else {
      throw new Error(
        `Could not find referenced entity ${JSON.stringify(
          entityRef
        )} in collection`
      )
    }
  }
  return match
}

const listFind = (list: MaterializedEntity[], entityRef: EntityRef) =>
  list.findIndex((e) => areMatch(e.entityRef, entityRef))

const applyUpdate = (
  target: MaterializedEntity,
  data: MaterializedData,
  changes: PropertyChange[]
) => {
  if (target.state === "deleted") {
    throw new Error("Cannot update a deleted entity")
  }
  if (target.state === "original") {
    target.state = "modified"
  }
  for (const c of changes) {
    const prop = AllProperties[c.property]
    if (prop === undefined) {
      throw new Error(`Property ${c.property} was not found`)
    }
    if (prop.schema !== target.entityRef.schema) {
      throw new Error(
        `Property ${c.property} does not belong to target schema ${target.entityRef.schema}`
      )
    }
    if (c.kind === "direct") {
      target.data[prop.label] = isEntityRef(c.changed)
        ? getEntity(data, c.changed)
        : c.changed
    } else if (c.kind === "linked") {
      target.data[prop.label] = c.next === null ? null : getEntity(data, c.next)
    } else if (c.kind === "owned") {
      const owned = getEntity(data, c.ownedEntityId)
      const prev = target.data[prop.label]
      // Make sure that if there is already an owned entity, that the same
      // entity is updated. If a new owned entity is required, first a direct
      // prop replacement update should be made (and the old owned entity
      // possibly deleted).
      if (prev !== null) {
        if (!isMaterializedEntity(prev)) {
          throw new Error("Expected an entity for owned property update")
        }
        if (!areMatch(prev.entityRef, c.ownedEntityId)) {
          throw new Error(
            `An owned entity is already set for ${
              prop.label
            }: old => ${JSON.stringify(prev.entityRef)}, new => ${
              c.ownedEntityId.id
            }`
          )
        }
      }
      target.data[prop.label] = applyUpdate(owned, data, c.changes)
    } else if (c.kind === "list") {
      const list = target.data[prop.label]
      if (!isMaterializedEntityArray(list)) {
        throw new Error(
          `Expected a materialized entity array for ${prop.label}`
        )
      }
      for (const rm of c.removed) {
        const idx = listFind(list, rm)
        if (idx < 0) {
          throw new Error(`Cannot remove element: id ${rm.id} not found`)
        }
        list.splice(idx, 1)
      }
      for (const mod of c.modified) {
        const idx = listFind(list, mod.idConn)
        if (idx < 0 !== (mod.idConn.type === "new")) {
          throw new Error("Invalid m2m list update")
        }
        const connEntity = getEntity(data, mod.idConn)
        applyUpdate(connEntity, data, mod.connection)
        if (idx < 0) {
          list.push(connEntity)
        } else {
          list[idx] = connEntity
        }
        const ownedEntity = Object.values(connEntity.data)
          .filter(isMaterializedEntity)
          .find((e) => areMatch(e.entityRef, mod.ownedChanges.ownedEntityId))
        if (ownedEntity === undefined) {
          throw new Error("Right side of m2m connection was not matched")
        }
        applyUpdate(ownedEntity, data, mod.ownedChanges.changes)
      }
    } else {
      throw new Error(`Unknown property change type: ${c}`)
    }
  }
  return target
}

/**
 * Apply entity changes to the materialized data.
 *
 * - This method assumes that every transitive reference is materialized.
 * - The changes *mutate* the objects, caller should make defensive copies if
 *   necessary.
 * - May throw if there are invalid or inconsistent changes, or a referenced
 *   entity is not found among the materialized data.
 */
export const applyChanges = (
  data: MaterializedData,
  changes: EntityChange[]
) => {
  for (const change of changes) {
    const match = getEntity(data, change.entityRef)
    if (change.type === "delete") {
      match.state = "deleted"
    } else if (change.type === "undelete") {
      match.state = change.entityRef.type === "new" ? "new" : "modified"
    } else if (change.type === "update") {
      applyUpdate(match, data, change.changes)
    } else {
      throw new Error(`Unknown entity change type: ${change}`)
    }
  }
}

export const getChangeRefs = (change: EntityChange): EntityRef[] => {
  if (change.type === "delete" || change.type === "undelete") {
    return [change.entityRef]
  }
  const result: EntityRef[] = []
  const recurse = (changes: PropertyChange[]) => {
    for (const c of changes) {
      if (c.kind === "linked" && c.next !== null) {
        result.push(c.next)
      } else if (c.kind === "owned") {
        result.push(c.ownedEntityId)
        recurse(c.changes)
      } else if (c.kind === "list") {
        result.push(...c.removed)
        for (const mod of c.modified) {
          result.push(mod.idConn)
          result.push(mod.ownedChanges.ownedEntityId)
        }
      }
    }
  }
  if (change.type === "update") {
    result.push(change.entityRef)
    // Changes may reference more entities.
    recurse(change.changes)
  }
  return result
}

/**
 * Retrieves all unique entity references that are required by the given
 * sequence of changes.
 */
export const getChangeSetRefs = (changes: EntityChange[]) => {
  const all = changes.flatMap(getChangeRefs)
  // Eliminate duplicate entries.
  const keys = new Set<string>()
  for (let i = all.length - 1; i >= 0; --i) {
    const e = all[i]
    const key = `${e.schema}_${e.id}`
    if (keys.has(key)) {
      all.splice(i, 1)
    } else {
      keys.add(key)
    }
  }
  return all
}
