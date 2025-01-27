import { PropertyValidation } from "./validation"

export interface BaseProperty {
  uid: string
  kind: string
  label: string
  schema: string
  backingField: string
  description?: string
  /**
   * An optional logical grouping of properties.
   */
  section?: string
  validation?: PropertyValidation
}

export interface TextProperty extends BaseProperty {
  readonly kind: "text"
  // By default text is non nullable
  // (empty string should work most of the time).
  nullable?: boolean
}

export interface NumberProperty extends BaseProperty {
  readonly kind: "number"
  // For our use case it seems that the majority of numbers
  // are nullable, so we make that the default.
  notNull?: boolean
}

export interface BoolProperty extends BaseProperty {
  readonly kind: "bool"
  nullable?: boolean
  defaultValue: boolean
}

export interface PartialDate {
  year: number
  month?: number
  day?: number
}

export const isPartialDate = (value: any): value is PartialDate =>
  value && value.year

export interface DateProperty extends BaseProperty {
  readonly kind: "date"
}

export interface OneToManyEntityRelation {
  readonly relationKind: "oneToMany"
  childBackingProp: string
}

export interface ManyToManyEntityRelation {
  readonly relationKind: "manyToMany"
  connectionEntity: string
  leftSideBackingField: string
  rightSideBackingField: string
}

export interface EntityLinkBaseProperty extends BaseProperty {
  /**
   * The schema of the linked entity.
   */
  linkedEntitySchema: string
}

export interface LinkedEntityProperty extends EntityLinkBaseProperty {
  readonly kind: "linkedEntity"
  notNull?: boolean
}

/**
 * This property consists of an entity that is owned through a one-to-one
 * relationship.
 */
export interface EntityOwnedProperty extends EntityLinkBaseProperty {
  readonly kind: "entityOwned"
  oneToOneBackingField: string
  notNull?: boolean
}

export enum ListEditMode {
  None = 0,
  Add = 1,
  Remove = 2,
  Modify = 4,
  All = 7
}

export interface EntityListBaseProperty extends EntityLinkBaseProperty {
  editModes: ListEditMode
}

export interface OwnedEntityListProperty extends EntityListBaseProperty {
  readonly kind: "ownedEntityList"
  connection: OneToManyEntityRelation
}

export interface ManyToManyEntityListProperty extends EntityListBaseProperty {
  readonly kind: "m2mEntityList"
  connection: ManyToManyEntityRelation
}

export interface TableProperty extends Omit<BaseProperty, "backingField"> {
  readonly kind: "table"
  columns: string[]
  rows: string[]
  /**
   * Determines the backing field for this table cell.
   */
  cellField: (col: number, row: number) => string
}

export type Property =
  | TextProperty
  | NumberProperty
  | BoolProperty
  | LinkedEntityProperty
  | EntityOwnedProperty
  | OwnedEntityListProperty
  | ManyToManyEntityListProperty
  | TableProperty
