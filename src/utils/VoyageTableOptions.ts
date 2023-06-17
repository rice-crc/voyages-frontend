
import TABLE_FLAT from "@/utils/voyages_example_table_flatfile.json";
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
    TABLE_FLAT.forEach((value) => {
        const fieldsData = value.cell_val.fields;
        processFieldsData(fieldsData);
    });

    return columnObject;
};
