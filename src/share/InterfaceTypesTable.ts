export interface VoyageOptionsGropProps {
    id: number
    voyage_itinerary: VoyageItinerary
    voyage_dates: VoyageDates
    voyage_groupings: VoyageGroupings
    voyage_crew: VoyageCrew
    voyage_ship: VoyageShip
    voyage_captainconnection: VoyageCaptainconnection[]
    voyage_shipownerconnection: VoyageShipownerconnection[]
    voyage_slaves_numbers: VoyageSlavesNumbers
    voyage_outcome: VoyageOutcome
    voyage_sourceconnection: VoyageSourceconnection[]
    voyage_id: number
    voyage_in_cd_rom: boolean
    last_update: string
    dataset: number
    african_info: any[]
    cargo: any[]
}

export interface VoyageItinerary {
    id: number
    port_of_departure: PortOfDeparture
    int_first_port_emb: IntFirstPortEmb
    int_second_port_emb: any
    int_first_region_purchase_slaves: IntFirstRegionPurchaseSlaves
    int_second_region_purchase_slaves: any
    int_first_port_dis: any
    int_second_port_dis: any
    int_first_region_slave_landing: any
    imp_principal_region_slave_dis: ImpPrincipalRegionSlaveDis
    int_second_place_region_slave_landing: any
    first_place_slave_purchase: FirstPlaceSlavePurchase
    second_place_slave_purchase: any
    third_place_slave_purchase: any
    first_region_slave_emb: FirstRegionSlaveEmb
    second_region_slave_emb: any
    third_region_slave_emb: any
    port_of_call_before_atl_crossing: any
    first_landing_place: FirstLandingPlace
    second_landing_place: any
    third_landing_place: any
    first_landing_region: FirstLandingRegion
    second_landing_region: any
    third_landing_region: any
    place_voyage_ended: any
    region_of_return: any
    broad_region_of_return: any
    imp_port_voyage_begin: ImpPortVoyageBegin
    imp_region_voyage_begin: ImpRegionVoyageBegin
    imp_broad_region_voyage_begin: ImpBroadRegionVoyageBegin
    principal_place_of_slave_purchase: PrincipalPlaceOfSlavePurchase
    imp_principal_place_of_slave_purchase: ImpPrincipalPlaceOfSlavePurchase
    imp_principal_region_of_slave_purchase: ImpPrincipalRegionOfSlavePurchase
    imp_broad_region_of_slave_purchase: ImpBroadRegionOfSlavePurchase
    principal_port_of_slave_dis: PrincipalPortOfSlaveDis
    imp_principal_port_slave_dis: ImpPrincipalPortSlaveDis
    imp_broad_region_slave_dis: ImpBroadRegionSlaveDis
    ports_called_buying_slaves: any
    number_of_ports_of_call: any
    voyage: number
}

export interface PortOfDeparture {
    id: number
    geo_location: GeoLocation
}

export interface GeoLocation {
    id: number
    spatial_extent: any
    location_type: LocationType
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType {
    id: number
    name: string
}

export interface IntFirstPortEmb {
    id: number
    geo_location: GeoLocation2
}

export interface GeoLocation2 {
    id: number
    spatial_extent: any
    location_type: LocationType2
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType2 {
    id: number
    name: string
}

export interface IntFirstRegionPurchaseSlaves {
    id: number
    geo_location: GeoLocation3
}

export interface GeoLocation3 {
    id: number
    spatial_extent: any
    location_type: LocationType3
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: boolean
    show_on_voyage_map: any
    child_of: number
}

export interface LocationType3 {
    id: number
    name: string
}

export interface ImpPrincipalRegionSlaveDis {
    id: number
    geo_location: GeoLocation4
}

export interface GeoLocation4 {
    id: number
    spatial_extent: any
    location_type: LocationType4
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: boolean
    show_on_voyage_map: any
    child_of: number
}

export interface LocationType4 {
    id: number
    name: string
}

export interface FirstPlaceSlavePurchase {
    id: number
    geo_location: GeoLocation5
}

export interface GeoLocation5 {
    id: number
    spatial_extent: any
    location_type: LocationType5
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType5 {
    id: number
    name: string
}

export interface FirstRegionSlaveEmb {
    id: number
    geo_location: GeoLocation6
}

export interface GeoLocation6 {
    id: number
    spatial_extent: any
    location_type: LocationType6
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: boolean
    show_on_voyage_map: any
    child_of: number
}

export interface LocationType6 {
    id: number
    name: string
}

export interface FirstLandingPlace {
    id: number
    geo_location: GeoLocation7
}

export interface GeoLocation7 {
    id: number
    spatial_extent: any
    location_type: LocationType7
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType7 {
    id: number
    name: string
}

export interface FirstLandingRegion {
    id: number
    geo_location: GeoLocation8
}

export interface GeoLocation8 {
    id: number
    spatial_extent: any
    location_type: LocationType8
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: boolean
    show_on_voyage_map: any
    child_of: number
}

export interface LocationType8 {
    id: number
    name: string
}

export interface ImpPortVoyageBegin {
    id: number
    geo_location: GeoLocation9
}

export interface GeoLocation9 {
    id: number
    spatial_extent: any
    location_type: LocationType9
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType9 {
    id: number
    name: string
}

export interface ImpRegionVoyageBegin {
    id: number
    geo_location: GeoLocation10
}

export interface GeoLocation10 {
    id: number
    spatial_extent: any
    location_type: LocationType10
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: boolean
    show_on_voyage_map: any
    child_of: number
}

export interface LocationType10 {
    id: number
    name: string
}

export interface ImpBroadRegionVoyageBegin {
    id: number
    geo_location: GeoLocation11
}

export interface GeoLocation11 {
    id: number
    spatial_extent: any
    location_type: LocationType11
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: any
    show_on_voyage_map: any
    child_of: any
}

export interface LocationType11 {
    id: number
    name: string
}

export interface PrincipalPlaceOfSlavePurchase {
    id: number
    geo_location: GeoLocation12
}

export interface GeoLocation12 {
    id: number
    spatial_extent: any
    location_type: LocationType12
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType12 {
    id: number
    name: string
}

export interface ImpPrincipalPlaceOfSlavePurchase {
    id: number
    geo_location: GeoLocation13
}

export interface GeoLocation13 {
    id: number
    spatial_extent: any
    location_type: LocationType13
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType13 {
    id: number
    name: string
}

export interface ImpPrincipalRegionOfSlavePurchase {
    id: number
    geo_location: GeoLocation14
}

export interface GeoLocation14 {
    id: number
    spatial_extent: any
    location_type: LocationType14
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: boolean
    show_on_voyage_map: any
    child_of: number
}

export interface LocationType14 {
    id: number
    name: string
}

export interface ImpBroadRegionOfSlavePurchase {
    id: number
    geo_location: GeoLocation15
}

export interface GeoLocation15 {
    id: number
    spatial_extent: any
    location_type: LocationType15
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: any
    show_on_voyage_map: any
    child_of: any
}

export interface LocationType15 {
    id: number
    name: string
}

export interface PrincipalPortOfSlaveDis {
    id: number
    geo_location: GeoLocation16
}

export interface GeoLocation16 {
    id: number
    spatial_extent: any
    location_type: LocationType16
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType16 {
    id: number
    name: string
}

export interface ImpPrincipalPortSlaveDis {
    id: number
    geo_location: GeoLocation17
}

export interface GeoLocation17 {
    id: number
    spatial_extent: any
    location_type: LocationType17
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: any
    show_on_main_map: boolean
    show_on_voyage_map: boolean
    child_of: number
}

export interface LocationType17 {
    id: number
    name: string
}

export interface ImpBroadRegionSlaveDis {
    id: number
    geo_location: GeoLocation18
}

export interface GeoLocation18 {
    id: number
    spatial_extent: any
    location_type: LocationType18
    name: string
    longitude: string
    latitude: string
    value: number
    dataset: any
    show_on_map: boolean
    show_on_main_map: any
    show_on_voyage_map: any
    child_of: any
}

export interface LocationType18 {
    id: number
    name: string
}

export interface VoyageDates {
    id: number
    voyage_began: string
    voyage_began_mm: number
    voyage_began_dd: number
    voyage_began_yyyy: number
    slave_purchase_began: string
    slave_purchase_began_mm: any
    slave_purchase_began_dd: any
    slave_purchase_began_yyyy: any
    vessel_left_port: string
    vessel_left_port_mm: any
    vessel_left_port_dd: any
    vessel_left_port_yyyy: any
    first_dis_of_slaves: string
    first_dis_of_slaves_mm: number
    first_dis_of_slaves_dd: number
    first_dis_of_slaves_yyyy: number
    date_departed_africa: string
    date_departed_africa_mm: any
    date_departed_africa_dd: any
    date_departed_africa_yyyy: any
    arrival_at_second_place_landing: string
    arrival_at_second_place_landing_mm: any
    arrival_at_second_place_landing_dd: any
    arrival_at_second_place_landing_yyyy: any
    third_dis_of_slaves: string
    third_dis_of_slaves_mm: any
    third_dis_of_slaves_dd: any
    third_dis_of_slaves_yyyy: any
    departure_last_place_of_landing: string
    departure_last_place_of_landing_mm: any
    departure_last_place_of_landing_dd: any
    departure_last_place_of_landing_yyyy: any
    voyage_completed: string
    voyage_completed_mm: any
    voyage_completed_dd: any
    voyage_completed_yyyy: any
    length_middle_passage_days: number
    imp_voyage_began: string
    imp_voyage_began_yyyy: number
    imp_departed_africa: string
    imp_departed_africa_yyyy: number
    imp_arrival_at_port_of_dis: string
    imp_arrival_at_port_of_dis_yyyy: number
    imp_length_home_to_disembark: number
    imp_length_leaving_africa_to_disembark: number
    voyage: number
}

export interface VoyageGroupings {
    id: number
    name: string
    value: number
}

export interface VoyageCrew {
    id: number
    crew_voyage_outset: number
    crew_departure_last_port: any
    crew_first_landing: any
    crew_return_begin: any
    crew_end_voyage: any
    unspecified_crew: any
    crew_died_before_first_trade: any
    crew_died_while_ship_african: any
    crew_died_middle_passage: any
    crew_died_in_americas: any
    crew_died_on_return_voyage: any
    crew_died_complete_voyage: any
    crew_deserted: any
    voyage: number
}

export interface VoyageShip {
    id: number
    rig_of_vessel: RigOfVessel
    imputed_nationality: ImputedNationality
    ton_type: any
    vessel_construction_place: any
    vessel_construction_region: any
    registered_place: any
    registered_region: any
    ship_name: string
    tonnage: any
    guns_mounted: any
    year_of_construction: any
    registered_year: any
    tonnage_mod: any
    nationality_ship: any
    voyage: number
}

export interface RigOfVessel {
    id: number
    name: string
    value: number
}

export interface ImputedNationality {
    id: number
    name: string
    value: number
}

export interface VoyageCaptainconnection {
    id: number
    captain: Captain
    captain_order: number
    voyage: number
}

export interface Captain {
    id: number
    name: string
}

export interface VoyageShipownerconnection {
    id: number
    owner: Owner
    owner_order: number
    voyage: number
}

export interface Owner {
    id: number
    name: string
}

export interface VoyageSlavesNumbers {
    id: number
    slave_deaths_before_africa: any
    slave_deaths_between_africa_america: any
    slave_deaths_between_arrival_and_sale: any
    num_slaves_intended_first_port: any
    num_slaves_intended_second_port: any
    num_slaves_carried_first_port: any
    num_slaves_carried_second_port: any
    num_slaves_carried_third_port: any
    total_num_slaves_purchased: any
    total_num_slaves_dep_last_slaving_port: any
    total_num_slaves_arr_first_port_embark: number
    num_slaves_disembark_first_place: any
    num_slaves_disembark_second_place: any
    num_slaves_disembark_third_place: any
    imp_total_num_slaves_embarked: number
    imp_total_num_slaves_disembarked: number
    imp_jamaican_cash_price: any
    imp_mortality_during_voyage: any
    num_men_embark_first_port_purchase: any
    num_women_embark_first_port_purchase: any
    num_boy_embark_first_port_purchase: any
    num_girl_embark_first_port_purchase: any
    num_adult_embark_first_port_purchase: any
    num_child_embark_first_port_purchase: any
    num_infant_embark_first_port_purchase: any
    num_males_embark_first_port_purchase: any
    num_females_embark_first_port_purchase: any
    num_men_died_middle_passage: any
    num_women_died_middle_passage: any
    num_boy_died_middle_passage: any
    num_girl_died_middle_passage: any
    num_adult_died_middle_passage: any
    num_child_died_middle_passage: any
    num_infant_died_middle_passage: any
    num_males_died_middle_passage: any
    num_females_died_middle_passage: any
    num_men_disembark_first_landing: any
    num_women_disembark_first_landing: any
    num_boy_disembark_first_landing: any
    num_girl_disembark_first_landing: any
    num_adult_disembark_first_landing: any
    num_child_disembark_first_landing: any
    num_infant_disembark_first_landing: any
    num_males_disembark_first_landing: any
    num_females_disembark_first_landing: any
    num_men_embark_second_port_purchase: any
    num_women_embark_second_port_purchase: any
    num_boy_embark_second_port_purchase: any
    num_girl_embark_second_port_purchase: any
    num_adult_embark_second_port_purchase: any
    num_child_embark_second_port_purchase: any
    num_infant_embark_second_port_purchase: any
    num_males_embark_second_port_purchase: any
    num_females_embark_second_port_purchase: any
    num_men_embark_third_port_purchase: any
    num_women_embark_third_port_purchase: any
    num_boy_embark_third_port_purchase: any
    num_girl_embark_third_port_purchase: any
    num_adult_embark_third_port_purchase: any
    num_child_embark_third_port_purchase: any
    num_infant_embark_third_port_purchase: any
    num_males_embark_third_port_purchase: any
    num_females_embark_third_port_purchase: any
    num_men_disembark_second_landing: any
    num_women_disembark_second_landing: any
    num_boy_disembark_second_landing: any
    num_girl_disembark_second_landing: any
    num_adult_disembark_second_landing: any
    num_child_disembark_second_landing: any
    num_infant_disembark_second_landing: any
    num_males_disembark_second_landing: any
    num_females_disembark_second_landing: any
    imp_num_adult_embarked: any
    imp_num_children_embarked: any
    imp_num_male_embarked: any
    imp_num_female_embarked: any
    total_slaves_embarked_age_identified: any
    total_slaves_embarked_gender_identified: any
    imp_adult_death_middle_passage: any
    imp_child_death_middle_passage: any
    imp_male_death_middle_passage: any
    imp_female_death_middle_passage: any
    imp_num_adult_landed: any
    imp_num_child_landed: any
    imp_num_male_landed: any
    imp_num_female_landed: any
    total_slaves_landed_age_identified: any
    total_slaves_landed_gender_identified: any
    total_slaves_dept_or_arr_age_identified: any
    total_slaves_dept_or_arr_gender_identified: any
    imp_slaves_embarked_for_mortality: any
    imp_num_men_total: any
    imp_num_women_total: any
    imp_num_boy_total: any
    imp_num_girl_total: any
    imp_num_adult_total: any
    imp_num_child_total: any
    imp_num_males_total: any
    imp_num_females_total: any
    total_slaves_embarked_age_gender_identified: any
    total_slaves_by_age_gender_identified_among_landed: any
    total_slaves_by_age_gender_identified_departure_or_arrival: any
    percentage_boys_among_embarked_slaves: any
    child_ratio_among_embarked_slaves: any
    percentage_girls_among_embarked_slaves: any
    male_ratio_among_embarked_slaves: any
    percentage_men_among_embarked_slaves: any
    percentage_women_among_embarked_slaves: any
    percentage_boys_among_landed_slaves: any
    child_ratio_among_landed_slaves: any
    percentage_girls_among_landed_slaves: any
    male_ratio_among_landed_slaves: any
    percentage_men_among_landed_slaves: any
    percentage_women_among_landed_slaves: any
    percentage_men: any
    percentage_women: any
    percentage_boy: any
    percentage_girl: any
    percentage_male: any
    percentage_child: any
    percentage_adult: any
    percentage_female: any
    imp_mortality_ratio: any
    voyage: number
}

export interface VoyageOutcome {
    id: number
    outcome_owner: OutcomeOwner
    outcome_slaves: OutcomeSlaves
    particular_outcome: ParticularOutcome
    resistance: any
    vessel_captured_outcome: VesselCapturedOutcome
    voyage: number
}

export interface OutcomeOwner {
    id: number
    name: string
    value: number
}

export interface OutcomeSlaves {
    id: number
    name: string
    value: number
}

export interface ParticularOutcome {
    id: number
    name: string
    value: number
}

export interface VesselCapturedOutcome {
    id: number
    name: string
    value: number
}

export interface VoyageSourceconnection {
    id: number
    source: Source
    doc: any
    text_ref: string
    voyage: number
}

export interface Source {
    id: number
    short_ref: string
    full_ref: string
    source_type: number
}
export interface RowData {
    [key: string]: string | unknown;
}

export interface ColumnDef {
    headerName: string;
    field: string;
    sortable: boolean;
    resizable: boolean;
    filter: boolean;
    valueGetter: (params: any) => any;
    rowData: RowData[];
}
export interface StateRowData {
    rowData: RowData[];
    columnDefs: ColumnDef[];
}

