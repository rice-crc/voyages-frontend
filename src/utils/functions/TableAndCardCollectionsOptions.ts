import TABLE_FLAT from '@/utils/flatfiles/voyages/voyage_table_cell_structure__updated21June.json';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved/enslaved_table_cell_structure.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/enslaved/african_origins_table_cell_structure.json';
import TEXAS_TABLE from '@/utils/flatfiles/enslaved/enslaved_texas_table_cell_structure.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers/enslavers_table_cell_structure.json';
import CARDS_VOYAGES_COLLECTION from '@/utils/flatfiles/voyages/transatlantic_voyages_card.json';
import CARDS_ENSLAVED_COLLECTION from '@/utils/flatfiles/enslaved/enslaved_card.json';
import CARDS_ENSLAVERS_COLLECTION from '@/utils/flatfiles/enslavers/enslavers_card.json';
import {
    AFRICANORIGINS_TABLE_FILE,
    ENSLAVEDCARDFILE,
    ENSLAVED_TABLE_FILE,
    ENSLAVERSCARDFILE,
    ENSLAVERS_TABLE_FILE,
    TEXAS_TABLE_FILE,
    VOYAGESTABLEFILE,
    YOYAGESCARDFILE,
} from '@/share/CONST_DATA';

export const TableAndCardCollectionsOptions = (file?: string): Record<string, any> => {

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

    if (file === VOYAGESTABLEFILE) {
        TABLE_FLAT.cell_structure.forEach((value) => {
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
    } else if (file === YOYAGESCARDFILE) {
        CARDS_VOYAGES_COLLECTION.forEach((value) => {
            value.children.forEach((element) => {
                const fieldsData = element.cell_val?.fields;
                processFieldsData(fieldsData);
            })
        });
    }
    else if (file === ENSLAVEDCARDFILE) {
        CARDS_ENSLAVED_COLLECTION.forEach((value) => {
            value.children.forEach((element) => {
                const fieldsData = element.cell_val?.fields;
                processFieldsData(fieldsData);
            })
        });
    }
    else if (file === ENSLAVERSCARDFILE) {
        CARDS_ENSLAVERS_COLLECTION.forEach((value) => {
            value.children.forEach((element) => {
                const fieldsData = element.cell_val?.fields;
                processFieldsData(fieldsData);
            })
        });
    }
    return columnObject;
};
