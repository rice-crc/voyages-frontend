import { VoyageOptionsGropProps } from "@/share/InterfaceTypesTable";
import { traverseData } from "./traverseData";
import { VoyageTableOptions } from "./VoyageTableOptions";
export const generateRowsData = (
    dataRow: VoyageOptionsGropProps[]
): Record<string, any> => {
    const finalRowArr: Record<string, any>[] = [];
    const columns = VoyageTableOptions();
    const varNames = columns.var_name;
    dataRow.forEach((data) => {
        const finalRowObj: Record<string, any> = {};
        varNames.forEach((varName: string) => {

            const varArray = varName.split("__");

            const output = traverseData(data, varArray);
            finalRowObj[varName] = output;
        });
        finalRowArr.push(finalRowObj)
    })
    // console.log('generateRowsData', finalRowArr)
    return finalRowArr;
};
