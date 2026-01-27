import {
  ENSALVERSTYLE,
  INTRAAMERICANTRADS,
  TRANSATLANTICTRADS,
} from '@/share/CONST_DATA';
import { TYPESOFDATASET, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/enslaved/enslaved_african_origins_table.json';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved/enslaved_all_table.json';
import TEXAS_TABLE from '@/utils/flatfiles/enslaved/enslaved_texas_table.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers/enslavers_table.json';
import AllVoyages_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_all_table.json';
import INDIANOCEANANDASIAN_TABLE from '@/utils/flatfiles/voyages/voyages_indian_ocean_and_asia_slave_trade_database_table.json';
import Intraamerican_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_intraamerican_table.json';
import Transatlantic_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_transatlantic_table.json';
import { checkRouteForVoyages } from '@/utils/functions/checkPagesRoute';

export const fetchTableCellStructure = async (styleNameRoute?: string) => {
  let cellStructure = null;

  if (styleNameRoute === TYPESOFDATASET.transatlantic) {
    cellStructure = Transatlantic_TABLE_FLAT.cell_structure;
  } else if (styleNameRoute === TYPESOFDATASET.intraAmerican) {
    cellStructure = Intraamerican_TABLE_FLAT.cell_structure;
  } else if (styleNameRoute === TYPESOFDATASET.indianOceanAndAsiaSlaveTrades) {
    cellStructure = INDIANOCEANANDASIAN_TABLE.cell_structure;
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
