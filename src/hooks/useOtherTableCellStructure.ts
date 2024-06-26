import { checkPagesRouteForVoyages } from "@/utils/functions/checkPagesRoute";
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved/enslaved_table_cell_structure.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/enslaved/african_origins_table_cell_structure.json';
import TEXAS_TABLE from '@/utils/flatfiles/enslaved/enslaved_texas_table_cell_structure.json';
import VOYAGESTABLE_FLAT from '@/utils/flatfiles/voyages/voyage_table_cell_structure__updated21June.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers/enslavers_table_cell_structure.json';
import { TYPESOFDATASETPEOPLE } from "@/share/InterfaceTypes";
import { ENSALVERSTYLE, INTRAAMERICANTRADS, TRANSATLANTICTRADS } from "@/share/CONST_DATA";


export const useOtherTableCellStructure = (styleNameRoute?: string) => {
    let otherCellStructure = null;
    if (checkPagesRouteForVoyages(styleNameRoute!)) {
        otherCellStructure = VOYAGESTABLE_FLAT.other_properties;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved) {
        otherCellStructure = ENSLAVED_TABLE.other_properties;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.africanOrigins) {
        otherCellStructure = AFRICANORIGINS_TABLE.other_properties;
    } else if (styleNameRoute === TYPESOFDATASETPEOPLE.texas) {
        otherCellStructure = TEXAS_TABLE.other_properties;
    } else if (styleNameRoute === ENSALVERSTYLE) {
        otherCellStructure = ENSLAVERS_TABLE.other_properties;
    } else if (styleNameRoute === INTRAAMERICANTRADS) {
        otherCellStructure = ENSLAVERS_TABLE.other_properties;
    } else if (styleNameRoute === TRANSATLANTICTRADS) {
        otherCellStructure = ENSLAVERS_TABLE.other_properties;
    }
    return otherCellStructure
};