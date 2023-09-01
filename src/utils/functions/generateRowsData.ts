import { traverseData } from './traverseData';
import { TableAndCardCollectionsOptions } from './TableAndCardCollectionsOptions';

export const generateRowsData = (
    dataRow: Record<string, any>[],
    file?: string,
): Record<string, any>[] => {
    const finalRowArr: Record<string, any>[] = [];

    const columns = TableAndCardCollectionsOptions(file);

    const varNames = columns.var_name;

    dataRow.forEach((data) => {
        const finalRowObj: Record<string, any> = {};
        varNames.forEach((varName: string) => {
            const varArray = varName.split('__');

            const output = traverseData(data, varArray);

            finalRowObj[varName] = flattenData(output);
        });
        finalRowArr.push(finalRowObj);
    });

    return finalRowArr;
};

const flattenData = (data: any): any => {
    return Array.isArray(data) ? data.flat(3) : data ?? null;
};
