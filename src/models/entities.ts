import {
  EntityValueProperty,
  NumberProperty,
  Property,
  TableProperty,
  TextProperty
} from "./properties"
import { lengthValidation, rangeValidation } from "./validation"

/**
 * Contribution modes
 * - Full
 * The entity can be selected directly for data contribution.
 *
 * - Owned
 * The entity shows up as a child entry of another entity and
 * is not directly selectable for contributions.
 *
 * - ReadOnly
 * The entity shows up as a child entry and its values cannot
 * be modified. E.g. an entity may have an associated Location,
 * the Location itself should not be modified, but the entity
 * can be updated to point to /another/ location or null.
 */
export type EntityContributionMode = "Full" | "Owned" | "ReadOnly"

export interface EntitySchema {
  name: string
  backingModel: string
  pkField: string
  contributionMode: EntityContributionMode
  properties: Property[]
}

/** 
A helper class to build entities, allowing some fields to be automatically set
and ensuring that all built schemas are added to the collection of all schemas.
*/
class EntitySchemaBuilder {
  disposed: boolean = false
  props: Property[]

  constructor(
    private info: Omit<EntitySchema, "properties">,
    private built: EntitySchema[],
    initProps?: Property[]
  ) {
    this.props = initProps ?? []
  }

  add = <T extends Property>(prop: Omit<T, "schema">) => {
    if (this.disposed) {
      throw new Error("disposed")
    }
    this.props.push({ ...prop, schema: this.info.name } as T)
    return this
  }

  _mkUid = (suffix: string) => `${this.info.name}_${suffix}`

  addText = (prop: Omit<TextProperty, "uid" | "kind" | "schema">) =>
    this.add<TextProperty>({
      ...prop,
      kind: "text",
      uid: this._mkUid(prop.backingField)
    })

  addNumber = (prop: Omit<NumberProperty, "uid" | "kind" | "schema">) =>
    this.add<NumberProperty>({
      ...prop,
      kind: "number",
      uid: this._mkUid(prop.backingField)
    })

  addTable = (prop: Omit<TableProperty, "kind" | "schema">) =>
    this.add<TableProperty>({ ...prop, kind: "table" })

  addEntityValue = (
    prop: Omit<
      EntityValueProperty,
      "uid" | "kind" | "schema" | "linkedEntitySchema"
    > & { linkedEntitySchema: EntitySchema }
  ) =>
    this.add<EntityValueProperty>({
      ...prop,
      kind: "entityValue",
      linkedEntitySchema: prop.linkedEntitySchema.name,
      uid: this._mkUid(prop.backingField || prop.label)
    })

  build = (): EntitySchema => {
    if (this.disposed) {
      throw new Error("disposed")
    }
    this.disposed = true
    const schema = { ...this.info, properties: [...this.props] }
    this.built.push(schema)
    return schema
  }
}

export const AllSchemas: EntitySchema[] = []

const mkBuilder = (
  info: Omit<EntitySchema, "properties">,
  initProps?: Property[]
) => new EntitySchemaBuilder(info, AllSchemas, initProps)

export const SparseDateSchema = mkBuilder({
  name: "VoyageSparseDate",
  backingModel: "voyage_sparse_date",
  pkField: "id",
  contributionMode: "Owned"
})
  .addNumber({
    label: "Year",
    backingField: "year",
    validation: rangeValidation(0, 2050)
  })
  .addNumber({
    label: "Month",
    backingField: "month",
    validation: rangeValidation(1, 12)
  })
  .addNumber({
    label: "Day",
    backingField: "day",
    validation: rangeValidation(1, 31)
  })
  .build()

export const NationalitySchema = mkBuilder({
  name: "Nationality",
  backingModel: "nationality",
  pkField: "id",
  contributionMode: "ReadOnly"
})
  .addText({
    label: "Nation name",
    backingField: "name",
    description: "Name of the nation"
  })
  .addNumber({
    label: "Code",
    backingField: "value",
    description: "Identification code for the Nation"
  })
  .build()

export const TonTypeSchema = mkBuilder({
  name: "TonType",
  backingModel: "ton_type",
  pkField: "id",
  contributionMode: "ReadOnly"
})
  .addText({
    label: "Ton type label",
    backingField: "name",
    description: "The type of tonnage value for vessels"
  })
  .addNumber({
    label: "Code",
    backingField: "value",
    description: "Identification code for the Ton Type"
  })
  .build()


export const RigOfVesselSchema = mkBuilder({
  name: "RigOfVessel",
  backingModel: "rig_of_vessel",
  pkField: "id",
  contributionMode: "ReadOnly"
})
  .addText({
    label: "Ton type label",
    backingField: "name",
    description: "The type of tonnage value for vessels"
  })
  .addNumber({
    label: "Code",
    backingField: "value",
    description: "Identification code for the Ton Type"
  })
  .build()

export const Location = mkBuilder({
  name: "Location",
  backingModel: "location",
  pkField: "uuid",
  contributionMode: "ReadOnly"
})
  .addText({
    label: "Name",
    backingField: "name"
  })
  .build()

export const VoyageShipEntitySchema = mkBuilder({
  name: "VoyageShip",
  backingModel: "voyageship",
  pkField: "id",
  contributionMode: "Owned"
})
  .addText({
    label: "Name of vessel",
    backingField: "ship_name",
    description: "The name of the ship",
    validation: lengthValidation(3, 255)
  })
  .addEntityValue({
    label: "National carrier",
    backingField: "nationality_ship",
    linkedEntitySchema: NationalitySchema
  })
  .addEntityValue({
    label: "Ton type",
    backingField: "ton_type",
    linkedEntitySchema: TonTypeSchema
  })
  .addNumber({
    label: "Tonnage of vessel",
    backingField: "tonnage"
  })
  .addEntityValue({
    label: "Rig of vessel",
    backingField: "rig_of_vessel",
    linkedEntitySchema: RigOfVesselSchema
  })
  .addNumber({
    label: "Guns mounted",
    backingField: "guns_mounted"
  })
  .addNumber({
    label: "Year of vessel's construction",
    backingField: "year_of_construction"
  })
  .addEntityValue({
    label: "Construction place",
    backingField: "vessel_construction_place",
    linkedEntitySchema: Location
  })
  .addNumber({
    label: "Year of vessel's registeration",
    backingField: "registered_year"
  })
  .addEntityValue({
    label: "Registered place",
    backingField: "vessel_registered_place",
    linkedEntitySchema: Location
  })
  .addEntityValue({
    label: "Nationality",
    backingField: "imputed_nationality",
    linkedEntitySchema: NationalitySchema
  })
  .addNumber({
    label: "Tonnage standardized on British measured tons, 1773-1870",
    backingField: "tonnage_mod"
  })
  .build()

export const VoyageItinerarySchema = mkBuilder({
  name: "VoyageItinerary",
  backingModel: "voyageitinerary",
  pkField: "id",
  contributionMode: "Owned"
})
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Port of departure",
    backingField: "port_of_departure"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "First intended port of embarkation (EMBPORT)",
    backingField: "int_first_port_emb"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Second intended port of embarkation (EMBPORT2)",
    backingField: "int_second_port_emb"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "First intended port of disembarkation (ARRPORT)",
    backingField: "int_first_port_dis"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Second intended port of disembarkation (ARRPORT2)",
    backingField: "int_second_port_dis"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Third intended port of disembarkation (ARRPORT3)",
    backingField: "int_third_port_dis"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Fourth intended port of disembarkation (ARRPORT4)",
    backingField: "int_fourth_port_dis"
  })
  .addNumber({
    label: "Number of ports of call prior to buying slaves (NPPRETRA)",
    backingField: "ports_called_buying_slaves"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "First place of slave purchase (PLAC1TRA)",
    backingField: "first_place_slave_purchase"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Second place of slave purchase (PLAC2TRA)",
    backingField: "second_place_slave_purchase"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Third place of slave purchase (PLAC3TRA)",
    backingField: "third_place_slave_purchase"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Port of call before Atlantic crossing (NPAFTTRA)",
    // backingField: "Third place of slave purchase (PLAC3TRA)"
    backingField: "port_of_call_before_atlantic_crossing"
  })
  .addNumber({
    label: "Number of ports of call in Americas prior to sale of slaves",
    backingField: "number_of_ports_of_call"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "First place of slave landing (SLA1PORT)",
    backingField: "first_landing_place"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Second place of slave landing (ADPSALE1)",
    backingField: "second_landing_place"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Third place of slave landing (ADPSALE2)",
    backingField: "third_landing_place"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Place at which voyage ended (PORTRET)",
    backingField: "place_voyage_ended"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Imputed port where voyage began (PTDEPIMP)",
    backingField: "imp_port_voyage_begin"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Principal place of slave purchase (MAJBUYPT)",
    backingField: "principal_place_of_slave_purchase"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Imputed principal place of slave purchase (MJBYPTIMP)",
    backingField: "imp_principal_place_of_slave_purchase"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Principal port of slave disembarkation (MAJSELPT)",
    backingField: "principal_port_of_slave_dis"
  })
  .addEntityValue({
    linkedEntitySchema: Location,
    label: "Imputed principal port of slave disembarkation (MJSLPTIMP)",
    backingField: "imp_principal_port_slave_dis"
  })
  .build()



const SectionSNO = "Ship, Nations, Owners"
const SectionNumbers = "Slaves (numbers)"
const SectionCharacteristics = "Slaves (Characteristics)"

const slaveNumberFields = [
  ["num_men_embark_first_port_purchase"],
  ["num_women_embark_first_port_purchase"],
  [],
  [],
  [],
  []
]

export const VoyageSlaveNumbersSchema = mkBuilder({
  name: "VoyageSlaveNumbers",
  backingModel: "voyageslavenumbers",
  contributionMode: "Owned",
  pkField: "id"
})
  .addNumber({
    label: "SlavesIntendedFirstPortPurchase",
    description: "Slaves intended from first port of purchase",
    backingField: "num_slaves_intended_first_port",
    section: SectionNumbers
  })
  .addTable({
    uid: "sn_characteristics",
    label: "Slave characteristics",
    section: SectionCharacteristics,
    columns: [
      "MEN",
      "WOMEN",
      "BOY",
      "GIRL",
      "MALE",
      "FEMALE",
      "ADULT",
      "CHILD",
      "INFANT"
    ],
    rows: [
      "Embarked slaves (first port)",
      "Embarked slaves (second port)",
      "Embarked slaves (third port)",
      "Died on voyage",
      "Disembarked slaves (first port)",
      "Disembarked slaves (second port)"
    ],
    cellField: (col, row) => {
      return slaveNumberFields[row][col] ?? `SLAVE_NUMBER_${col}x${row}`
    }
  })
  .build()

export const VoyageDatesSchema = mkBuilder({
  name: "VoyageDates",
  backingModel: "voyage_dates",
  contributionMode: "Owned",
  pkField: "id"
})
  .addNumber({
    label: "Length of Middle Passage in (days) (VOYAGE)",
    backingField: "length_middle_passage_days"
  })
  .addNumber({
    label: "Voyage length from home port to disembarkation (days) (VOY1IMP)",
    backingField: "imp_length_home_to_disembark"
  })
  .addNumber({
    label:
      "Voyage length from last slave embarkation to first disembarkation (days) (VOY2IMP)",
    backingField: "imp_length_leaving_africa_to_disembark"
  })
  .addEntityValue({
    label: "Date that voyage began (DATEDEPB,A,C)",
    backingField: "voyage_began_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Date that slave purchase began (D1SLATRB,A,C)",
    backingField: "slave_purchase_began_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Date that vessel left last slaving port (DLSLATRB,A,C)",
    backingField: "vessel_left_port_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Date of first disembarkation of slaves (DATARR33,32,34)",
    backingField: "first_dis_of_slaves_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Date vessel departed Africa (DATELEFTAFR)",
    backingField: "date_departed_africa_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Date of arrival at second place of landing (DATARR37,36,38)",
    backingField: "arrival_at_second_place_landing_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Date of third disembarkation of slaves (DATARR40,39,41)",
    backingField: "third_dis_of_slaves_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Date of departure from last place of landing (DDEPAMB,*,C)",
    backingField: "departure_last_place_of_landing_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Date on which slave voyage completed (DATARR44,43,45)",
    backingField: "voyage_completed_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Voyage began",
    backingField: "imp_voyage_began_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Departed Africa",
    backingField: "imp_departed_africa_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .addEntityValue({
    label: "Year of arrival at port of disembarkation (YEARAM)",
    backingField: "imp_arrival_at_port_of_dis_sparsedate",
    linkedEntitySchema: SparseDateSchema
  })
  .build()

// TODO: this is a work in progress to map the full Voyage Entity to our
// abstractions.
export const VoyageSchema = mkBuilder({
  name: "Voyage",
  backingModel: "voyage",
  contributionMode: "Full",
  pkField: "voyage_id"
})
  .addNumber({
    label: "Voyage ID",
    backingField: "voyage_id",
    description: "The unique ID of the voyage",
    validation: rangeValidation(1, 99999999999)
  })
  .addNumber({
    label: "Dataset",
    backingField: "dataset",
    description: "The Dataset to which this voyage is associated",
    notNull: true
  })
  .addEntityValue({
    oneToOneBackingField: "voyage",
    backingField: "",
    linkedEntitySchema: VoyageShipEntitySchema,
    label: "Ship",
    description: "Ship that performed the voyage",
    section: SectionSNO,
    notNull: true
  })
  .addEntityValue({
    oneToOneBackingField: "voyage",
    backingField: "",
    linkedEntitySchema: VoyageItinerarySchema,
    label: "Itinerary",
    notNull: true
  })
  .addEntityValue({
    oneToOneBackingField: "voyage",
    backingField: "",
    linkedEntitySchema: VoyageDatesSchema,
    label: "Dates",
    notNull: true
  })
  .addEntityValue({
    oneToOneBackingField: "voyage",
    backingField: "voyage",
    linkedEntitySchema: VoyageSlaveNumbersSchema,
    label: "Slave numbers",
    section: SectionNumbers,
    notNull: true
  })
  .build()

const SchemaIndex = AllSchemas.reduce(
  (agg, s) => ({ ...agg, [s.name]: s }),
  {} as Record<string, EntitySchema>
)

export const getSchema = (name: string): EntitySchema => {
  const s = SchemaIndex[name]
  if (!s) {
    throw new Error(`Schema ${name} does not exist`)
  }
  return s
}

export const AllProperties = AllSchemas.flatMap((s) => s.properties).reduce(
  (agg, p) => {
    if (agg[p.uid] !== undefined) {
      throw new Error(`Duplicate property uid: ${p.uid} @ schema ${p.schema}`)
    }
    return { ...agg, [p.uid]: p }
  },
  {} as Record<string, Property>
)

export const getSchemaProp = (s: EntitySchema, label: string) =>
  s.properties.find((p) => p.label === label)

const schemaExists = (name: string) => SchemaIndex[name] !== undefined

// Some validation code to make sure that all properties reference existing
// schemas.
for (const prop of Object.values(AllProperties)) {
  if (!schemaExists(prop.schema)) {
    throw Error(`Schema ${prop.schema} does not exists`)
  }
  if (prop.kind === "entityValue" && !schemaExists(prop.linkedEntitySchema)) {
    throw Error(`Linked schema ${prop.linkedEntitySchema} does not exists`)
  }
}
