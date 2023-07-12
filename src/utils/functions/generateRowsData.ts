import { VoyageOptionsGropProps } from '@/share/InterfaceTypesTable';
import { traverseData } from './traverseData';
import { TableCollectionsOptions } from './TableCollectionsOptions';

export const generateRowsData = (
    dataRow: VoyageOptionsGropProps[],
    file?: string,
): Record<string, any> => {
    const finalRowArr: Record<string, any>[] = [];
    const columns = TableCollectionsOptions(file);
    const varNames = columns.var_name;
    dataRow.forEach((data) => {
        const finalRowObj: Record<string, any> = {};
        varNames.forEach((varName: string) => {

            const varArray = varName.split('__');

            const output = traverseData(data, varArray);

            finalRowObj[varName] = output;
        });
        finalRowArr.push(finalRowObj)
    })
    return finalRowArr;
};
