import { EntityLinkBaseProperty, EntityLinkEditMode, ListEditMode, Property, PropertyAccessLevel } from "./properties"
import { EntitySchemaBuilder } from "./schemaBuilder"
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
  backingTable: string
  pkField: string
  contributionMode: EntityContributionMode
  properties: Property[]
}

export type BuilderEntityProp<T extends EntityLinkBaseProperty> = Omit<
  T,
  "uid" | "kind" | "schema" | "linkedEntitySchema"
> & { linkedEntitySchema: EntitySchema }

export const AllSchemas: EntitySchema[] = []

const mkBuilder = (
  info: Omit<EntitySchema, "properties">,
  initProps?: Property[]
) => new EntitySchemaBuilder(info, AllSchemas, initProps)

export const SparseDateSchema = mkBuilder({
  name: "VoyageSparseDate",
  backingTable: "voyage_voyagesparsedate",
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
  backingTable: "voyage_nationality",
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
  backingTable: "voyage_tontype",
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
  backingTable: "voyage_rigofvessel",
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
  backingTable: "geo_location",
  pkField: "id",
  contributionMode: "ReadOnly"
})
  .addText({
    label: "Name",
    backingField: "name"
  })
  .addNumber({
    label: "Code",
    backingField: "value",
    description: "Identification code for the Location"
  })
  .build()

export const VoyageShipEntitySchema = mkBuilder({
  name: "VoyageShip",
  backingTable: "voyage_voyageship",
  pkField: "id",
  contributionMode: "Owned"
})
  .addText({
    label: "Name of vessel",
    backingField: "ship_name",
    description: "The name of the ship",
    validation: lengthValidation(3, 255)
  })
  .addLinkedEntity({
    label: "National carrier",
    backingField: "nationality_ship_id",
    linkedEntitySchema: NationalitySchema,
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    label: "Ton type",
    backingField: "ton_type_id",
    linkedEntitySchema: TonTypeSchema,
    mode: EntityLinkEditMode.Select
  })
  .addNumber({
    label: "Tonnage of vessel",
    backingField: "tonnage"
  })
  .addLinkedEntity({
    label: "Rig of vessel",
    backingField: "rig_of_vessel_id",
    linkedEntitySchema: RigOfVesselSchema,
    mode: EntityLinkEditMode.Select
  })
  .addNumber({
    label: "Guns mounted",
    backingField: "guns_mounted"
  })
  .addNumber({
    label: "Year of vessel's construction",
    backingField: "year_of_construction"
  })
  .addLinkedEntity({
    label: "Construction place",
    backingField: "vessel_construction_place_id",
    linkedEntitySchema: Location,
    mode: EntityLinkEditMode.Select
  })
  .addNumber({
    label: "Year of vessel's registration",
    backingField: "registered_year"
  })
  .addLinkedEntity({
    label: "Registered place",
    backingField: "registered_place_id",
    linkedEntitySchema: Location,
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    label: "Nationality",
    backingField: "imputed_nationality_id",
    linkedEntitySchema: NationalitySchema,
    mode: EntityLinkEditMode.Select
  })
  .addNumber({
    label: "Tonnage standardized on British measured tons, 1773-1870",
    backingField: "tonnage_mod"
  })
  .build()

export const VoyageItinerarySchema = mkBuilder({
  name: "VoyageItinerary",
  backingTable: "voyage_voyageitinerary",
  pkField: "id",
  contributionMode: "Owned"
})
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Port of departure",
    backingField: "port_of_departure_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "First intended port of embarkation",
    description: "First intended port of embarkation (EMBPORT)",
    backingField: "int_first_port_emb_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Second intended port of embarkation",
    description: "Second intended port of embarkation (EMBPORT2)",
    backingField: "int_second_port_emb_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "First intended port of disembarkation (ARRPORT)",
    backingField: "int_first_port_dis_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Second intended port of disembarkation (ARRPORT2)",
    backingField: "int_second_port_dis_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Third intended port of disembarkation (ARRPORT3)",
    backingField: "int_third_port_dis_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Fourth intended port of disembarkation (ARRPORT4)",
    backingField: "int_fourth_port_dis_id",
    mode: EntityLinkEditMode.Select
  })
  .addNumber({
    label: "Number of ports of call prior to buying slaves (NPPRETRA)",
    backingField: "ports_called_buying_slaves"
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "First place of slave purchase (PLAC1TRA)",
    backingField: "first_place_slave_purchase_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Second place of slave purchase (PLAC2TRA)",
    backingField: "second_place_slave_purchase_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Third place of slave purchase (PLAC3TRA)",
    backingField: "third_place_slave_purchase_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Port of call before Atlantic crossing (NPAFTTRA)",
    backingField: "port_of_call_before_atl_crossing_id",
    mode: EntityLinkEditMode.Select
  })
  .addNumber({
    label: "Number of ports of call in Americas prior to sale of slaves",
    backingField: "number_of_ports_of_call"
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "First place of slave landing (SLA1PORT)",
    backingField: "first_landing_place_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Second place of slave landing (ADPSALE1)",
    backingField: "second_landing_place_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Third place of slave landing (ADPSALE2)",
    backingField: "third_landing_place_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Place at which voyage ended (PORTRET)",
    backingField: "place_voyage_ended_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Imputed port where voyage began (PTDEPIMP)",
    backingField: "imp_port_voyage_begin_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Principal place of slave purchase (MAJBUYPT)",
    backingField: "principal_place_of_slave_purchase_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Imputed principal place of slave purchase (MJBYPTIMP)",
    backingField: "imp_principal_place_of_slave_purchase_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Principal port of slave disembarkation (MAJSELPT)",
    backingField: "principal_port_of_slave_dis_id",
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    linkedEntitySchema: Location,
    label: "Imputed principal port of slave disembarkation (MJSLPTIMP)",
    backingField: "imp_principal_port_slave_dis_id",
    mode: EntityLinkEditMode.Select
  })
  .build()

const SectionSNO = "Ship, Nations, Owners"
const SectionCharacteristics = "Characteristics"

const slaveNumberPrefixes = [
  "num_men",
  "num_women",
  "num_boy",
  "num_girl",
  "num_males",
  "num_females",
  "num_adult",
  "num_child",
  "num_infant"
]

const slaveNumberImpPrefixes = [
  "num_men",
  "num_women",
  "num_boy",
  "num_girl",
  "num_male",
  "num_female",
  "num_adult",
  "num_child",
  "num_infant"
]

const slaveNumberSuffixes = [
  "embark_first_port_purchase",
  "embark_second_port_purchase",
  "embark_third_port_purchase",
  "died_middle_passage",
  "disembark_first_landing",
  "disembark_second_landing"
]

const slaveNumberImpSuffixes = [
  "embarked",
  "landed",
  "total",
  "death_middle_passage"
]

const slaveNumberColumns = [
  "MEN",
  "WOMEN",
  "BOYS",
  "GIRLS",
  "MALES",
  "FEMALES",
  "ADULTS",
  "CHILDREN",
  "INFANTS"
]

export const VoyageSlaveNumbersSchema = mkBuilder({
  name: "VoyageSlaveNumbers",
  backingTable: "voyage_voyageslavesnumbers",
  contributionMode: "Owned",
  pkField: "id"
})
  .addNumber({
    label: "SlavesIntendedFirstPortPurchase",
    description: "Slaves intended from first port of purchase",
    backingField: "num_slaves_intended_first_port",
    section: "Numbers"
  })
  .addTable({
    uid: "sn_characteristics",
    label: "Slave characteristics",
    section: SectionCharacteristics,
    columns: slaveNumberColumns,
    rows: [
      "Embarked slaves (first port)",
      "Embarked slaves (second port)",
      "Embarked slaves (third port)",
      "Died on voyage",
      "Disembarked slaves (first port)",
      "Disembarked slaves (second port)"
    ],
    cellField: (col, row) =>
      `${slaveNumberPrefixes[col]}_${slaveNumberSuffixes[row]}`
  })
  .addTable({
    uid: "sn_characteristics_imputed",
    label: "Slave characteristics (imputed)",
    section: SectionCharacteristics,
    columns: slaveNumberColumns.slice(0, -1),
    accessLevel: PropertyAccessLevel.Editor,
    rows: [
      "Imputed number at ports of purchase",
      "Imputed number at ports of landing",
      "Imputed number at departure or arrival",
      "Imputed deaths on middle passage"
    ],
    cellField: (col, row) => {
      // Ugly inconsistencies in naming!!
      if (row === 0 && col === 7) {
        return "imp_num_children_embarked"
      }
      if (row === 2 && col === 4) {
        return "imp_num_males_total"
      }
      if (row === 2 && col === 5) {
        return "imp_num_females_total"
      }
      let prefix = slaveNumberImpPrefixes[col]
      if (row === 3) {
        prefix = prefix.replace("num_", "")
      }
      return row === 2 || (col >= 4 && col <= 7)
        ? `imp_${prefix}_${slaveNumberImpSuffixes[row]}`
        : undefined
    }
  })
  .build()

export const VoyageDatesSchema = mkBuilder({
  name: "VoyageDates",
  backingTable: "voyage_voyagedates",
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
  .addLinkedEntity({
    label: "Date that voyage began (DATEDEPB,A,C)",
    backingField: "voyage_began_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Date that slave purchase began (D1SLATRB,A,C)",
    backingField: "slave_purchase_began_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Date that vessel left last slaving port (DLSLATRB,A,C)",
    backingField: "vessel_left_port_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Date of first disembarkation of slaves (DATARR33,32,34)",
    backingField: "first_dis_of_slaves_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Date vessel departed Africa (DATELEFTAFR)",
    backingField: "date_departed_africa_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Date of arrival at second place of landing (DATARR37,36,38)",
    backingField: "arrival_at_second_place_landing_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Date of third disembarkation of slaves (DATARR40,39,41)",
    backingField: "third_dis_of_slaves_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Date of departure from last place of landing (DDEPAMB,*,C)",
    backingField: "departure_last_place_of_landing_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Date on which slave voyage completed (DATARR44,43,45)",
    backingField: "voyage_completed_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Voyage began",
    backingField: "imp_voyage_began_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Departed Africa",
    backingField: "imp_departed_africa_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .addLinkedEntity({
    label: "Year of arrival at port of disembarkation (YEARAM)",
    backingField: "imp_arrival_at_port_of_dis_sparsedate_id",
    linkedEntitySchema: SparseDateSchema,
    mode: EntityLinkEditMode.Own
  })
  .build()

export const AfricanInfoSchema = mkBuilder({
  name: "AfricanInfo",
  backingTable: "voyage_africaninfo",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({ label: "Name", backingField: "name" })
  .addBool({
    label: "Possibly Offensive",
    backingField: "possibly_offensive",
    defaultValue: false
  })
  .build()

export const CargoUnitSchema = mkBuilder({
  name: "CargoUnit",
  backingTable: "voyage_cargounit",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({ label: "Name", backingField: "name" })
  .build()

export const CargoTypeSchema = mkBuilder({
  name: "CargoType",
  backingTable: "voyage_cargotype",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({ label: "Name", backingField: "name" })
  .build()

export const VoyageCargoConnectionSchema = mkBuilder({
  name: "VoyageCargoConnectionSchema",
  backingTable: "voyage_voyagecargoconnection",
  contributionMode: "Owned",
  pkField: "id"
})
  .addOwnerProp("voyage_id")
  .addLinkedEntity({
    backingField: "unit_id",
    label: "Cargo unit",
    linkedEntitySchema: CargoUnitSchema,
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    backingField: "cargo_id",
    label: "Cargo type",
    linkedEntitySchema: CargoTypeSchema,
    mode: EntityLinkEditMode.Select
  })
  .addNumber({
    backingField: "amount",
    label: "The amount of cargo according to the unit",
    notNull: false
  })
  .addBool({
    backingField: "is_purchasing_commmodity",
    label: "Was this a commodity used to purchase enslaved people",
    defaultValue: false
  })
  .build()

export const ParticularOutcomeSchema = mkBuilder({
  name: "ParticularOutcome",
  backingTable: "voyage_particularoutcome",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({ label: "Name", backingField: "name" })
  .addNumber({ label: "Value", backingField: "value" })
  .build()

export const EnslavedOutcomeSchema = mkBuilder({
  name: "SlavesOutcome",
  backingTable: "voyage_slavesoutcome",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({ label: "Name", backingField: "name" })
  .addNumber({ label: "Value", backingField: "value" })
  .build()

export const VesselOutcomeSchema = mkBuilder({
  name: "VesselOutcomeSchema",
  backingTable: "voyage_vesselcapturedoutcome",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({ label: "Name", backingField: "name" })
  .addNumber({ label: "Value", backingField: "value" })
  .build()

export const OwnerOutcomeSchema = mkBuilder({
  name: "OwnerOutcome",
  backingTable: "voyage_owneroutcome",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({ label: "Name", backingField: "name" })
  .addNumber({ label: "Value", backingField: "value" })
  .build()

export const ResistanceSchema = mkBuilder({
  name: "Resistance",
  backingTable: "voyage_resistance",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({ label: "Name", backingField: "name" })
  .addNumber({ label: "Value", backingField: "value" })
  .build()

export const VoyageOutcomeSchema = mkBuilder({
  name: "VoyageOutcome",
  backingTable: "voyage_voyageoutcome",
  contributionMode: "Owned",
  pkField: "id"
})
  .addLinkedEntity({
    backingField: "particular_outcome_id",
    label: "Particular Outcome",
    linkedEntitySchema: ParticularOutcomeSchema,
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    backingField: "resistance_id",
    label: "Resistance",
    linkedEntitySchema: ResistanceSchema,
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    backingField: "outcome_slaves_id",
    label: "Enslaved Outcome",
    linkedEntitySchema: EnslavedOutcomeSchema,
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    backingField: "vessel_captured_outcome_id",
    label: "Vessel Outcome",
    linkedEntitySchema: VesselOutcomeSchema,
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    backingField: "outcome_owner_id",
    label: "Owner Outcome",
    linkedEntitySchema: OwnerOutcomeSchema,
    mode: EntityLinkEditMode.Select
  })

export const EnslaverAliasBuilder = mkBuilder({
  name: "EnslaverAlias",
  backingTable: "past_enslaveralias",
  contributionMode: "Full",
  pkField: "id"
}).addText({
  backingField: "alias",
  label: "Alias"
})

export const EnslaverAliasSchema = EnslaverAliasBuilder.build()

export const EnslaverSchema = mkBuilder({
  name: "Enslaver",
  backingTable: "past_enslaveridentity",
  contributionMode: "Full",
  pkField: "id"
})
  .addOwnedEntityList({
    connection: {
      relationKind: "oneToMany",
      childBackingProp: "identity_id"
    },
    editModes: ListEditMode.All,
    label: "Aliases",
    linkedEntitySchema: EnslaverAliasSchema
  })
  .addText({
    backingField: "principal_alias",
    label: "Principal alias"
  })
  .addBool({
    backingField: "is_natural_person",
    label: "Is natural person",
    defaultValue: true
  })
  .addNumber({
    backingField: "birth_year",
    label: "Birth year"
  })
  .addNumber({
    backingField: "birth_month",
    label: "Birth month"
  })
  .addNumber({
    backingField: "birth_day",
    label: "Birth day"
  })
  .addLinkedEntity({
    label: "Birth place",
    backingField: "birth_place_id",
    linkedEntitySchema: Location,
    mode: EntityLinkEditMode.Select
  })
  .addNumber({
    backingField: "death_year",
    label: "Death year"
  })
  .addNumber({
    backingField: "death_month",
    label: "Death month"
  })
  .addNumber({
    backingField: "death_day",
    label: "Death day"
  })
  .addLinkedEntity({
    label: "Death place",
    backingField: "death_place_id",
    linkedEntitySchema: Location,
    mode: EntityLinkEditMode.Select
  })
  .addText({
    backingField: "father_name",
    label: "Father name"
  })
  .addText({
    backingField: "father_occupation",
    label: "Father occupation"
  })
  .addText({
    backingField: "mother_name",
    label: "Mother name"
  })
  .addText({
    backingField: "probate_date",
    label: "Probate date"
  })
  .addText({
    backingField: "will_value_pounds",
    label: "Will value (pounds)"
  })
  .addText({
    backingField: "will_value_dollars",
    label: "Will value (dollars)"
  })
  .addText({
    backingField: "will_court",
    label: "Will court"
  })
  .addLinkedEntity({
    label: "Principal location",
    backingField: "principal_location_id",
    linkedEntitySchema: Location,
    mode: EntityLinkEditMode.Select
  })
  .addText({
    backingField: "notes",
    label: "Notes"
  })
  .build()

/**
 * Our schemas must form an an acyclic graph, so we create a specialized
 * schema for EnslaverAlias which points to an Enslaver identity which then
 * points to the schema that doesn't point back to the identity.
 */
export const EnslaverAliasWithIdentitySchema = EnslaverAliasBuilder.clone(
  "EnslaverAliasWithIdentity"
)
  .addLinkedEntity({
    backingField: "identity_id",
    linkedEntitySchema: EnslaverSchema,
    label: "Identity",
    mode: EntityLinkEditMode.View
  })
  .build()

export const EnslavementRelationTypeSchema = mkBuilder({
  name: "EnslavementRelationType",
  backingTable: "past_enslavementrelationtype",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({
    label: "Relation type",
    backingField: "name",
    description: "A descriptive name for the type of enslavement relation"
  })
  .build()

export const EnslaverRoleSchema = mkBuilder({
  name: "EnslaverRole",
  backingTable: "past_enslaverrole",
  contributionMode: "ReadOnly",
  pkField: "id"
})
  .addText({
    label: "Enslaver role",
    backingField: "name",
    description:
      "A descriptive name for the role of the enslaver in an enslavement relation"
  })
  .build()

export const EnslaverRelationRoleConnectionSchema = mkBuilder({
  name: "EnslaverRelationRoleConn",
  backingTable: "past_enslaverinrelation_roles",
  contributionMode: "Owned",
  pkField: "id",
}).build()

export const EnslaverInRelationSchema = mkBuilder({
  name: "EnslaverInRelation",
  backingTable: "past_enslaverinrelation",
  contributionMode: "Owned",
  pkField: "id"
})
  .addLinkedEntity({
    backingField: "enslaver_alias_id",
    linkedEntitySchema: EnslaverAliasWithIdentitySchema,
    label: "Enslaver alias",
    mode: EntityLinkEditMode.Select
  })
  .addM2MEntityList({
    connection: {
      relationKind: "manyToMany",
      connectionEntity: EnslaverRelationRoleConnectionSchema.name,
      leftSideBackingField: "enslaverinrelation_id",
      rightSideBackingField: "enslaverrole_id"
    },
    label: "Roles",
    linkedEntitySchema: EnslaverRoleSchema,
    editModes: ListEditMode.Add | ListEditMode.Remove
  })
  .build()

export const EnslavementRelationSchema = mkBuilder({
  name: "EnslavementRelation",
  backingTable: "past_enslavementrelation",
  contributionMode: "Owned",
  pkField: "id"
})
  .addLinkedEntity({
    label: "Relation type",
    backingField: "relation_type_id",
    linkedEntitySchema: EnslavementRelationTypeSchema,
    mode: EntityLinkEditMode.Select
  })
  .addLinkedEntity({
    label: "Place",
    backingField: "place_id",
    linkedEntitySchema: Location,
    mode: EntityLinkEditMode.Select
  })
  .addText({
    backingField: "date",
    label: "Date",
    description: "Date in MM,DD,YYYY format with optional fields"
  })
  .addNumber({
    backingField: "amount",
    label: "Amount"
  })
  .addOwnedEntityList({
    connection: {
      relationKind: "oneToMany",
      childBackingProp: "relation_id"
    },
    editModes: ListEditMode.All,
    label: "Enslavers in relation",
    linkedEntitySchema: EnslaverInRelationSchema
  })
  .build()

// TODO: this is a work in progress to map the full Voyage Entity to our
// abstractions.
export const VoyageSchema = mkBuilder({
  name: "Voyage",
  backingTable: "voyage_voyage",
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
    notNull: true,
    accessLevel: PropertyAccessLevel.Editor
  })
  .addEntityOwned({
    oneToOneBackingField: "voyage_id",
    linkedEntitySchema: VoyageShipEntitySchema,
    label: "Ship",
    description: "Ship that performed the voyage",
    section: SectionSNO,
    notNull: true
  })
  .addEntityOwned({
    oneToOneBackingField: "voyage_id",
    section: "Voyage Itinerary",
    linkedEntitySchema: VoyageItinerarySchema,
    label: "Itinerary",
    notNull: true
  })
  .addEntityOwned({
    oneToOneBackingField: "voyage_id",
    section: "Voyage Dates",
    linkedEntitySchema: VoyageDatesSchema,
    label: "Dates",
    notNull: true
  })
  .addEntityOwned({
    oneToOneBackingField: "voyage_id",
    linkedEntitySchema: VoyageSlaveNumbersSchema,
    label: "Slave Numbers",
    section: "Slave Numbers",
    notNull: true
  })
  .addOwnedEntityList({
    label: "Cargo",
    linkedEntitySchema: VoyageCargoConnectionSchema,
    editModes: ListEditMode.All,
    connection: {
      relationKind: "oneToMany",
      childBackingProp: "voyage_id"
    }
  })
  .addOwnedEntityList({
    label: "Enslavement relations",
    linkedEntitySchema: EnslavementRelationSchema,
    editModes: ListEditMode.All,
    connection: {
      relationKind: "oneToMany",
      childBackingProp: "voyage_id"
    }
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
      throw new Error(`Duplicate property uid: ${p.uid} @ schema ${p.schema} (dupe @ ${agg[p.uid].schema})`)
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
  if (prop.kind === "linkedEntity" && !schemaExists(prop.linkedEntitySchema)) {
    throw Error(`Linked schema ${prop.linkedEntitySchema} does not exists`)
  }
}
