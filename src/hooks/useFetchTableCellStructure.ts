import {checkRouteForVoyages} from "@/utils/functions/checkPagesRoute";
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved/enslaved_all_table_menu.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/enslaved/enslaved_african_origins_table.json';
import TEXAS_TABLE from '@/utils/flatfiles/enslaved/enslaved_texas_table_cell_structure.json';
import Transatlantic_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_transatlantic_table.json';
import Intraamerican_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_intraamerican_table.json';
import AllVoyages_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_all_table.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers/enslavers_table.json';
import {TYPESOFDATASET, TYPESOFDATASETPEOPLE} from "@/share/InterfaceTypes";
import {ENSALVERSTYLE, INTRAAMERICANTRADS, TRANSATLANTICTRADS} from "@/share/CONST_DATA";

export const useFetchTableCellStructure = async (styleNameRoute?: string) => {
    let cellStructure = null;

    if (styleNameRoute === TYPESOFDATASET.transatlantic) {
        cellStructure = Transatlantic_TABLE_FLAT.cell_structure;
    } else if (styleNameRoute === TYPESOFDATASET.intraAmerican) {
        cellStructure = Intraamerican_TABLE_FLAT.cell_structure;
    } else if (checkRouteForVoyages(styleNameRoute!)) {
        cellStructure = AllVoyages_TABLE_FLAT.cell_structure;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.africanOrigins) {
        cellStructure = AFRICANORIGINS_TABLE.cell_structure;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.texas) {
        cellStructure = TEXAS_TABLE.cell_structure;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved) {
        cellStructure = ENSLAVED_TABLE.cell_structure;
    } else if (styleNameRoute === ENSALVERSTYLE) {
        cellStructure = ENSLAVERS_TABLE.cell_structure;
    } else if (styleNameRoute === INTRAAMERICANTRADS) {
        cellStructure = ENSLAVERS_TABLE.cell_structure;
    } else if (styleNameRoute === TRANSATLANTICTRADS) {
        cellStructure = ENSLAVERS_TABLE.cell_structure;
    }
    return cellStructure;
};