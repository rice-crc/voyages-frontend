import { checkPagesRouteForVoyages } from "@/utils/functions/checkPagesRoute";
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved/enslaved_table_cell_structure.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/enslaved/african_origins_table_cell_structure.json';
import TEXAS_TABLE from '@/utils/flatfiles/enslaved/enslaved_texas_table_cell_structure.json'
import VOYAGESTABLE_FLAT from '@/utils/flatfiles/voyages/voyage_table_cell_structure__updated21June.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers/enslavers_table_cell_structure.json';
import { TYPESOFDATASETPEOPLE } from "@/share/InterfaceTypes";
import { ENSALVERSTYLE, INTRAAMERICANTRADS, TRANSATLANTICTRADS } from "@/share/CONST_DATA";

export const useFetchTableCellStructure = async (styleNameRoute?: string) => {

    let cellStructure = null;
    if (checkPagesRouteForVoyages(styleNameRoute!)) {
        cellStructure = VOYAGESTABLE_FLAT.cell_structure;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved) {
        cellStructure = ENSLAVED_TABLE.cell_structure;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.africanOrigins) {
        cellStructure = AFRICANORIGINS_TABLE.cell_structure;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.texas) {
        cellStructure = TEXAS_TABLE.cell_structure;
    } else if (styleNameRoute === ENSALVERSTYLE) {
        cellStructure = ENSLAVERS_TABLE.cell_structure;
    } else if (styleNameRoute === INTRAAMERICANTRADS) {
        cellStructure = ENSLAVERS_TABLE.cell_structure;
    } else if (styleNameRoute === TRANSATLANTICTRADS) {
        cellStructure = ENSLAVERS_TABLE.cell_structure;
    }
    return cellStructure
};