import { TableCellStructure } from "@/share/InterfaceTypesTable";
import { ICellRendererParams } from "ag-grid-community";

export function hasValueGetter(
    params: ICellRendererParams,
    value: TableCellStructure
) {
    const finalData: string[] = [];
    const data = params.data;
    const fields = value.cell_val.fields;
    const firstData = data[fields[0]?.var_name];

    const joinDelimiter: string | undefined = value.cell_val.join;
    if (value.cell_type === 'literal') {
        const dataDisplay = data[fields[0].var_name]
        return dataDisplay ? dataDisplay : '--'
    } else if (value.colID === 'connections') {
        return data.id
    } else if (value.cell_type === 'literal-concat' && Array.isArray(firstData)) {
        for (let i = 0; i < firstData?.length; i++) {
            const dataResult = [];
            for (let j = 0; j < fields?.length; j++) {
                const fieldName = fields[j].var_name;
                const fieldValue = data[fieldName] ? data[fieldName][i] : '--';
                if (fieldValue !== undefined) {
                    dataResult.push(String(fieldValue ?? ""));
                } else {
                    dataResult.push(String('-'));
                }
            }
            finalData.push(dataResult.join(joinDelimiter));
        }

        return finalData.length !== 0 ? finalData : '--';
    } else if (value.cell_type === 'literal-concat') {
        let dataValue: string = '';
        for (let i = 0; i < fields.length; i++) {
            const fieldName = fields[i].var_name;
            const fieldValue = data[fieldName];
            if (fieldValue !== null) {
                dataValue += fieldValue + '  ';
            }
        }
        const result = dataValue.substring(0, dataValue.length - 1);
        return result
    }
}
