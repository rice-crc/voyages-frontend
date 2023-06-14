import { ColumnObjectProps, RowData } from "@/share/InterfaceTypes";
import { VoyageOptionsGropProps } from "@/share/InterfaceTypesTable";

export function createRowData(data: VoyageOptionsGropProps[], tableOptions: ColumnObjectProps) {
    const rows: RowData[] = [];

    data.forEach((row: VoyageOptionsGropProps) => {
        const rowData: RowData = {};
        Object.entries(row).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    if (tableOptions[key] === subKey) {
                        rowData[subKey] = subValue;
                    }
                });
            } else {
                rowData[key] = value;
            }
        });
        rows.push(rowData);
    });
    return rows;
}

