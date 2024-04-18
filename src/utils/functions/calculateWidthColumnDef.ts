import { TableCellStructure } from "@/share/InterfaceTypesTable";
import { ICellRendererParams } from "ag-grid-community";

export function calculateWidthColumnDef(
    value: TableCellStructure,
    colID: string,
) {

    let width = 200;
    if (colID === 'gender' || colID === 'height') {
        width = 90
    } else if (colID === "voyage_enslavers") {
        width = 320
    } else if (colID === 'enslavers') {
        width = 270
    } else if (colID === 'enslavement_relations') {
        width = 300
    } else if (colID === 'captive_fate__name' || colID === 'post_disembark_location__name' || colID === 'death' || colID === 'birth') {
        width = 260
    } else if (colID === 'voyages__voyage_sources' || colID === 'documentary_sources') {
        width = 380
    } else if (colID === 'voyages') {
        width = 720
    } else if (colID === "voyage_dates__imp_arrival_at_port_of_dis_sparsedate__year" || colID === 'voyage_id') {
        width = 100
    } else if (colID === 'connections') {
        width = 130
    } else if (colID === 'voyage_ship__ship_name' || colID === 'voyages__voyage_id' || colID === "enslaved_name") {
        width = 150
    } else if (colID === 'voyages__voyage_dates__imp_arrival_at_port_of_dis_sparsedate') {
        width = 170
    } else if (colID === 'voyage_sources') {
        width = 400
    } else if (colID === 'age') {
        width = 75
    }
    return width
}
