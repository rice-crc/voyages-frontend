import { checkRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved/enslaved_all_table.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/enslaved/enslaved_african_origins_table.json';
import TEXAS_TABLE from '@/utils/flatfiles/enslaved/enslaved_texas_table.json';
import Transatlantic_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_transatlantic_table.json';
import Intraamerican_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_intraamerican_table.json';
import AllVoyages_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_all_table.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers/enslavers_table.json';
import { TYPESOFDATASET, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import {
  ENSALVERSTYLE,
  INTRAAMERICANTRADS,
  TRANSATLANTICTRADS,
} from '@/share/CONST_DATA';

export const useOtherTableCellStructure = (styleNameRoute?: string) => {
  let otherCellStructure = null;
  if (styleNameRoute === TYPESOFDATASET.transatlantic) {
    otherCellStructure = Transatlantic_TABLE_FLAT.other_properties;
  } else if (styleNameRoute === TYPESOFDATASET.intraAmerican) {
    otherCellStructure = Intraamerican_TABLE_FLAT.other_properties;
  } else if (checkRouteForVoyages(styleNameRoute!)) {
    otherCellStructure = AllVoyages_TABLE_FLAT.other_properties;
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
  return otherCellStructure;
};
