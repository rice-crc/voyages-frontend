export function generateCardsData(
    data: any,
    value: any
) {
    const finalData: (string | String)[] = [];
    const fields = value.cell_val.fields;
    const firstData = data[fields[0]?.var_name];

    const joinDelimiter: string | undefined = value.cell_val.join;
    if (value.cell_type === "literal") {
        const dataDisplay = data[fields[0].var_name]
        return dataDisplay ? dataDisplay : '--'
    } else if (value.cell_type === "literal-concat" && Array.isArray(firstData)) {
        for (let i = 0; i < firstData?.length; i++) {
            const dataResult = [];
            const metadata: Record<string, any> = {};
            for (let j = 0; j < fields?.length; j++) {
                const fieldName = fields[j].var_name;
                const fieldValue = data[fieldName] ? data[fieldName][i] : '--';
                if (fields[j].cell_fn === 'metadata') {
                    metadata[fieldName] = fieldValue
                    continue
                }
                if (fieldValue !== undefined) {
                    dataResult.push(String(fieldValue ?? ""));
                } else {
                    dataResult.push(String('-'));
                }
            }
            // This is a trick that uses the String object to inject metadata
            // into the card data without breaking compatibility with the rest
            // of the code that expects a string.
            let item: string | String = dataResult.join(joinDelimiter);
            if (Object.keys(metadata).length > 0) {
                item = new String(item);
                Object.assign(item, metadata)
            }
            finalData.push(item);
        }
        return finalData.length !== 0 ? finalData : '--';
    } else if (value.cell_type === "literal-concat") {
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
