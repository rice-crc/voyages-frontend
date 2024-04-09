import { TableCellStructure } from "@/share/InterfaceTypesTable";
import { ICellRendererParams } from "ag-grid-community";

export function calculateWidthColumnDef(
    value: TableCellStructure,
    colID: string,
) {

    let width = 200;
    if (colID === 'connections' || colID === 'age' || colID === 'gender' || colID === 'height') {
        width = 150
    } else if (colID === "voyage_enslavers") {
        width = 320
    } else if (colID === 'voyages__voyage_id' || colID === 'enslavers' || colID === 'voyages__voyage_itinerary__imp_principal_place_of_slave_purchase__name' || colID === 'voyages__voyage_itinerary__imp_principal_port_slave_dis__name' || colID === 'voyages__voyage_dates__imp_arrival_at_port_of_dis_sparsedate') {
        width = 270
    } else if (colID === 'voyages__voyage_ship__ship_name' || colID === 'enslavers__enslaver' || colID === 'enslavement_relations') {
        width = 300
    } else if (colID === 'captive_fate__name' || colID === 'post_disembark_location__name' || colID === 'death' || colID === 'birth') {
        width = 260
    } else if (colID === 'voyage_sources' || colID === 'voyages__voyage_sources' || colID === 'documentary_sources') {
        width = 400
    } else if (colID === 'voyages') {
        width = 720
    }
    return width
}
