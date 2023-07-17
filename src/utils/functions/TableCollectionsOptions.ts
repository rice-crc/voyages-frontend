import TABLE_FLAT from '@/utils/flatfiles/voyage_table_cell_structure__updated21June.json';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved_table_cell_structure.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/african_origins_table_cell_structure.json';
import TEXAS_TABLE from '@/utils/flatfiles/texas_table_cell_structure.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers_table_cell_structure.json';
import {
    AFRICANORIGINS_TABLE_FILE,
    ENSLAVED_TABLE_FILE,
    ENSLAVERS_TABLE_FILE,
    TEXAS_TABLE_FILE,
} from '@/share/CONST_DATA';

export const TableCollectionsOptions = (file?: string): Record<string, any> => {
    const columnObject: Record<string, any> = {};
    const processFieldsData = (fieldsData: any[]): void => {
        fieldsData.forEach((field) => {
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
    if (!file) {
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
    }
    return columnObject;
};
