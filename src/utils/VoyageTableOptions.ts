
import TABLE_FLAT from "@/utils/voyage_table_cell_structure__updated21June.json";
export const VoyageTableOptions = (): Record<string, any> => {

    const columnObject: Record<string, any> = {};

    const processFieldsData = (fieldsData: any[]): void => {

        fieldsData.forEach((field) => {
            Object.entries(field).forEach(([key, value]) => {

                if (typeof value === "string") {
                    if (columnObject[key]) {
                        columnObject[key].push(value);
                    } else {
                        columnObject[key] = [value];
                    }
                } else if (typeof value === "object" && value !== null) {
                    processFieldsData([value]);
                }
            });
        });
    };
    TABLE_FLAT.cell_structure.forEach((value) => {
        const fieldsData = value.cell_val.fields;
        processFieldsData(fieldsData);
    });

    return columnObject;
};
