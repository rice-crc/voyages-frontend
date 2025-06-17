import TRANSATLANTIC_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_transatlantic_table.json';
import INTRAAMERICAN_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_intraamerican_table.json';
import ALLVOYAGES_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_all_table.json';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved/enslaved_all_table.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/enslaved/enslaved_african_origins_table.json';
import TEXAS_TABLE from '@/utils/flatfiles/enslaved/enslaved_texas_table.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers/enslavers_table.json';
import CARDS_TRANSATLANTIC_COLLECTION from '@/utils/flatfiles/voyages/voyages_transatlantic_card.json';
import CARDS_INTRAAMERICAN_COLLECTION from '@/utils/flatfiles/voyages/voyages_intraamerican_card.json';
import CARDS_ALLVOYAGES_COLLECTION from '@/utils/flatfiles/voyages/voyages_all_card.json';
import CARDS_ENSLAVED_african_origins from '@/utils/flatfiles/enslaved/enslaved_african_origins_card.json';
import CARDS_ALLENSLAVED from '@/utils/flatfiles/enslaved/enslaved_all_card.json';
import CARDS_ENSLAVERS_COLLECTION from '@/utils/flatfiles/enslavers/enslavers_card.json';
import CARDS_ENSLAVED_TEXAS from '@/utils/flatfiles/enslaved/enslaved_texas_card.json';
import {
  AFRICANORIGINS_TABLE_FILE,
  ENSLAVED_african_origins_CARDFILE,
  ENSLAVED_ALL_CARDFILE,
  ENSLAVED_TABLE_FILE,
  ENSLAVERSCARDFILE,
  ENSLAVERS_TABLE_FILE,
  TEXAS_TABLE_FILE,
  TRANSATLANTICFILECARD,
  INTRAAMERICANFILECARD,
  ALLVOYAGESFILECARD,
  TRANSATLANTICTABLEFILE,
  INTRAAMERICANTABLEFILE,
  ALLVOYAGESTABLEFILE,
  ENSLAVED_TEXAS_CARDFILE,
} from '@/share/CONST_DATA';

export const TableAndCardCollectionsOptions = (
  file?: string
): Record<string, any> => {
  const columnObject: Record<string, any> = {};
  const processFieldsData = (fieldsData: any[] | undefined): void => {
    fieldsData?.forEach((field) => {
      Object.entries(field).forEach(([key, value]) => {
        if (typeof value === 'string') {
          if (columnObject[key]) {
            columnObject[key].push(value);
          } else {
            columnObject[key] = [value];
          }
        } else if (typeof value === 'object' && value !== null) {
          processFieldsData([value]);
        }
      });
    });
  };

  if (file === TRANSATLANTICTABLEFILE) {
    TRANSATLANTIC_TABLE_FLAT.cell_structure.forEach((value) => {
      const fieldsData = value.cell_val.fields;
      processFieldsData(fieldsData);
    });
  } else if (file === INTRAAMERICANTABLEFILE) {
    INTRAAMERICAN_TABLE_FLAT.cell_structure.forEach((value) => {
      const fieldsData = value.cell_val.fields;
      processFieldsData(fieldsData);
    });
  } else if (file === ALLVOYAGESTABLEFILE) {
    ALLVOYAGES_TABLE_FLAT.cell_structure.forEach((value) => {
      const fieldsData = value.cell_val.fields;
      processFieldsData(fieldsData);
    });
  } else if (file === ENSLAVED_TABLE_FILE) {
    ENSLAVED_TABLE.cell_structure.forEach((value) => {
      const fieldsData = value.cell_val.fields;
      processFieldsData(fieldsData);
    });
  } else if (file === AFRICANORIGINS_TABLE_FILE) {
    AFRICANORIGINS_TABLE.cell_structure.forEach((value) => {
      const fieldsData = value.cell_val.fields;
      processFieldsData(fieldsData);
    });
  } else if (file === TEXAS_TABLE_FILE) {
    TEXAS_TABLE.cell_structure.forEach((value) => {
      const fieldsData = value.cell_val.fields;
      processFieldsData(fieldsData);
    });
  } else if (file === ENSLAVERS_TABLE_FILE) {
    ENSLAVERS_TABLE.cell_structure.forEach((value) => {
      const fieldsData = value.cell_val.fields;
      processFieldsData(fieldsData);
    });
  } else if (file === TRANSATLANTICFILECARD) {
    CARDS_TRANSATLANTIC_COLLECTION.forEach((value) => {
      value.children.forEach((element) => {
        const fieldsData = element.cell_val?.fields;
        processFieldsData(fieldsData);
      });
    });
  } else if (file === INTRAAMERICANFILECARD) {
    CARDS_INTRAAMERICAN_COLLECTION.forEach((value) => {
      value.children.forEach((element) => {
        const fieldsData = element.cell_val?.fields;
        processFieldsData(fieldsData);
      });
    });
  } else if (file === ALLVOYAGESFILECARD) {
    CARDS_ALLVOYAGES_COLLECTION.forEach((value) => {
      value.children.forEach((element) => {
        const fieldsData = element.cell_val?.fields;
        processFieldsData(fieldsData);
      });
    });
  } else if (file === ENSLAVED_african_origins_CARDFILE) {
    CARDS_ENSLAVED_african_origins.forEach((value) => {
      value.children.forEach((element) => {
        const fieldsData = element.cell_val?.fields;
        processFieldsData(fieldsData);
      });
    });
  } else if (file === ENSLAVED_ALL_CARDFILE) {
    CARDS_ALLENSLAVED.forEach((value) => {
      value.children.forEach((element) => {
        const fieldsData = element.cell_val?.fields;
        processFieldsData(fieldsData);
      });
    });
  } else if (file === ENSLAVERSCARDFILE) {
    CARDS_ENSLAVERS_COLLECTION.forEach((value) => {
      value.children.forEach((element) => {
        const fieldsData = element.cell_val?.fields;
        processFieldsData(fieldsData);
      });
    });
  } else if (file === ENSLAVED_TEXAS_CARDFILE) {
    CARDS_ENSLAVED_TEXAS.forEach((value) => {
      value.children.forEach((element) => {
        const fieldsData = element.cell_val?.fields;
        processFieldsData(fieldsData);
      });
    });
  }
  return columnObject;
};
