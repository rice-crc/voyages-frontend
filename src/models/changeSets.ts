import { AllProperties } from "./entities"
import { EntityListProperty, EntityValueProperty, Property } from "./properties"

export interface PropertyChangeBase {
  property: string
  comments?: string
}

export interface DirectPropertyChange extends PropertyChangeBase {
  readonly kind: "direct"
  changed: string | number | EntityRef | null
}

export const isDirectChange = (
  change: PropertyChange
): change is DirectPropertyChange => change.kind === "direct"

export interface EntityRef {
  type: "existing" | "new"
  schema: string
  id: string | number
}

export const isEntityRef = (maybeRef: EntityRef | any): maybeRef is EntityRef =>
  maybeRef !== null && typeof maybeRef === "object" && !!(maybeRef as EntityRef).schema && !!(maybeRef as EntityRef).id

export const areMatch = (a: EntityRef, b: EntityRef) =>
  a === b || (a.type === b.type && a.schema === b.schema && a.id === b.id)

export interface LinkedEntitySelectionChange extends PropertyChangeBase {
  readonly kind: "linked"
  /**
   * The id of the selected entity in the change.
   */
  next: EntityRef | null
}

export interface OwnedEntityChange extends PropertyChangeBase {
  readonly kind: "owned"
  ownedEntityId: EntityRef
  changes: PropertyChange[]
}

export const isOwnedEntityChange = (
  change: PropertyChange
): change is OwnedEntityChange => (change as OwnedEntityChange).kind === "owned"

export interface ManyToManyUpdate {
  /**
   * The reference to the connection entity.
   */
  idConn: EntityRef
  /**
   * The changes applied to the connection entity.
   */
  connection: PropertyChange[]
  /**
   * The changes applied to the owned-side of the connection. There may be no
   * changes at all, but the owned reference should be explicit.
   */
  ownedChanges: OwnedEntityChange
}

export interface EntityListChange extends PropertyChangeBase {
  readonly kind: "list"
  /**
   * A list of refs to the connection (M2M) entity that should be deleted.
   */
  removed: EntityRef[]
  /**
   * Modified or new entities in the list.
   */
  modified: ManyToManyUpdate[]
}

export type PropertyChange =
  | DirectPropertyChange
  | LinkedEntitySelectionChange
  | OwnedEntityChange
  | EntityListChange

/**
 * An entity update or insert.
 */
export interface EntityUpdate<TChange extends PropertyChange = PropertyChange> {
  readonly type: "update"
  entityRef: EntityRef
  changes: TChange[]
}

export interface EntityDelete {
  readonly type: "delete"
  entityRef: EntityRef
}

export interface EntityUndelete {
  readonly type: "undelete"
  entityRef: EntityRef
}

export type EntityChange = EntityUpdate | EntityDelete | EntityUndelete

type Ordered<T> = T & { order: number }

// This conditional type associates a PropertyChange type to the source Property
// type. This is useful later when we need to process a change and need the
// matching type.
type MatchingPropertyChangeType<T> = T extends
  | OwnedEntityChange
  | LinkedEntitySelectionChange
  ? EntityValueProperty
  : T extends EntityListChange
  ? EntityListProperty
  : Property

const isMatchingPropertyChangeType = <T extends PropertyChange>(
  prop: Property,
  change: T
): prop is MatchingPropertyChangeType<T> => {
  if (change.kind === "owned" || change.kind === "linked") {
    // A LinkedEntitySelectionChange requires that the FK be stored on the
    // parent entity, so we also validate this.
    return (
      prop.kind === "entityValue" &&
      (change.kind !== "linked" || !prop.oneToOneBackingField)
    )
  }
  if (change.kind === "list") {
    return prop.kind === "entityList"
  }
  return true
}

const validateAndGetProperty = <T extends PropertyChange>(
  change: T
): MatchingPropertyChangeType<T> => {
  const { property } = change
  const prop = AllProperties[property]
  if (!prop) {
    throw new Error(`Property ${property} not found`)
  }
  if (!isMatchingPropertyChangeType(prop, change)) {
    throw new Error(
      `Property ${property}'s type ${prop.kind} not compatible with change ${change.kind}`
    )
  }
  if (isOwnedEntityChange(change)) {
    const isValid =
      (prop as EntityValueProperty).linkedEntitySchema === change.ownedEntityId.schema
    if (isValid) {
      throw new Error(
        `Owned entity is different than its corresponding property`
      )
    }
  }
  return prop
}

export interface CombinedChangeSet {
  deletions: EntityDelete[]
  updates: EntityUpdate<DirectPropertyChange>[]
}

/**
 * Combine an ordered sequence of changes into a flat list of deletes and
 * updates containing only direct changes that can be inspected or applied in
 * a db transaction.
 */
export const combineChanges = (
  allChanges: EntityChange[]
): CombinedChangeSet => {
  const deletedEntries: Ordered<EntityDelete>[] = []
  const undeletedEntries: Ordered<EntityUndelete>[] = []
  const updatedEntries: Ordered<EntityUpdate>[] = []
  let order = 0
  for (const change of allChanges) {
    ++order
    if (change.type === "delete") {
      deletedEntries.push({ ...change, order })
    } else if (change.type === "undelete") {
      undeletedEntries.push({ ...change, order })
    } else if (change.type === "update") {
      updatedEntries.push({ ...change, order })
    } else {
      throw new Error(`Unknown change type ${JSON.stringify(change)}`)
    }
  }
  // Process and simplify/expand updates. For instance, a complex list update
  // may involve changes to the Many-to-Many model (connection) as well as
  // changes in the right-side entity.
  //
  // Note: new update entries are created and pushed to the end of the list.
  // Any entry processed and left on the array must contain only direct
  // updates to an entity. Therefore, a nested update A.B.C.x = "hello" is
  // first transformed to an update of "B", which is further processed to an
  // update of C (which is then a direct update).
  for (const u of updatedEntries) {
    const { order } = u
    for (let i = u.changes.length; i >= 0; --i) {
      const uc = u.changes[i]
      if (uc.kind === "owned") {
        const prop = validateAndGetProperty(uc)
        // Move the changes to a linked entity update entry.
        const ownedChanges: PropertyChange[] = [...uc.changes]
        if (prop.oneToOneBackingField) {
          ownedChanges.push({
            kind: "direct",
            property: prop.oneToOneBackingField,
            changed: u.entityRef,
            comments: uc.comments
          })
        } else {
          // We also need to update the parent entity to point to the
          // owned entity.
          updatedEntries.push({
            type: "update" as const,
            changes: [
              {
                kind: "direct",
                property: prop.backingField,
                changed: uc.ownedEntityId,
                comments: uc.comments
              }
            ],
            entityRef: u.entityRef,
            order
          })
        }
        updatedEntries.push({
          type: "update" as const,
          changes: ownedChanges,
          entityRef: uc.ownedEntityId,
          order
        })
        u.changes.splice(i, 1)
      } else if (uc.kind === "list") {
        const prop = validateAndGetProperty(uc)
        for (const r of uc.removed) {
          deletedEntries.push({
            type: "delete",
            entityRef: r,
            order
          })
        }
        for (const m of uc.modified) {
          // Process changes to the right side of the M2M
          // relationship.
          if (m.ownedChanges.changes.length > 0) {
            updatedEntries.push({
              type: "update" as const,
              changes: m.ownedChanges.changes,
              entityRef: m.ownedChanges.ownedEntityId,
              order
            })
          }
          // Process changes made to the connection table of the M2M
          // relation.
          updatedEntries.push({
            type: "update" as const,
            changes: [
              ...m.connection,
              {
                kind: "direct" as const,
                property: prop.leftSideBackingField,
                changed: u.entityRef,
                comments: ""
              },
              {
                kind: "direct" as const,
                property: prop.rightSideBackingField,
                changed: m.ownedChanges.ownedEntityId,
                comments: ""
              }
            ],
            entityRef: m.idConn,
            order
          })
        }
        u.changes.splice(i, 1)
      } else if (uc.kind === "linked") {
        const prop = validateAndGetProperty(uc)
        // This is a direct update on a FK value of the entity.
        updatedEntries.push({
          type: "update" as const,
          changes: [
            {
              kind: "direct" as const,
              property: prop.backingField,
              changed: uc.next,
              comments: uc.comments
            }
          ],
          entityRef: u.entityRef,
          order
        })
        u.changes.splice(i, 1)
      } else if (uc.kind !== "direct") {
        throw new Error(
          `Unknown property change kind in: ${JSON.stringify(uc)}`
        )
      }
    }
  }
  // After expansion, sort by order.
  updatedEntries.sort((x, y) => x.order - y.order)
  deletedEntries.sort((x, y) => x.order - y.order)
  // Remove any updates with zero changes (which could happen after
  // simplification, or perhaps the UI allowed them just to allow for a
  // comment).
  for (let i = updatedEntries.length - 1; i >= 0; --i) {
    const { changes } = updatedEntries[i]
    if (changes.length === 0) {
      updatedEntries.splice(i, 1)
    } else if (changes.findIndex((c) => c.kind !== "direct") >= 0) {
      // At this point, only direct changes should appear in updated
      // entries.
      throw new Error("[BUG]: Could not simplify change sets")
    }
  }
  // First match delete-Cancel x deleted.
  for (const dc of undeletedEntries) {
    let match = -1
    for (let i = 0; i < deletedEntries.length; ++i) {
      const d = deletedEntries[i]
      if (dc.order < d.order) {
        break
      }
      if (areMatch(d.entityRef, dc.entityRef)) {
        match = i
      }
    }
    if (match < 0) {
      throw new Error(
        `A delete cancel operation ${JSON.stringify(
          dc
        )} does not match a previous delete operation.`
      )
    }
    // Remove the matched delete.
    deletedEntries.splice(match, 1)
  }
  // At this point any surviving delete entry should be applied to the
  // combined change set. We delete any updates referencing the deleted entity
  // (which could also be a New entity).
  for (let i = deletedEntries.length - 1; i >= 0; --i) {
    // We iterate in reverse order to allow removing entries from the array
    // without impacting the enumeration.
    const { order, entityRef: entityId } = deletedEntries[i]
    // An existing entity was marked for deletion, clear any updates to
    // the same entity appearing before the deletion and raise an error
    // if any update occurs *after* the deletion.
    for (let j = updatedEntries.length - 1; j >= 0; --j) {
      const u = updatedEntries[j]
      if (areMatch(u.entityRef, entityId)) {
        if (u.order > order) {
          throw new Error(`Update on ${entityId} after its deletion`)
        }
        updatedEntries.splice(j, 1)
      }
    }
  }
  // We next merge the updates so that all changes to a given entity appear in
  // a single update.
  const mergedUpdates: Record<string, EntityUpdate<DirectPropertyChange>> = {}
  for (const u of updatedEntries) {
    const id = `${u.entityRef.schema}_${u.entityRef.id}`
    const prev = mergedUpdates[id]
    let changes = u.changes.filter(isDirectChange)
    if (prev) {
      changes = [...prev.changes, ...changes]
    }
    mergedUpdates[id] = { ...u, changes }
  }
  return {
    deletions: deletedEntries,
    updates: Object.values(mergedUpdates)
  }
}
