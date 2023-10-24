import { fetchPastEnslavedServiceData } from "@/fetch/pastEnslavedFetch/fetchPastEnslavedServiceData";

export const extractTestVarNamesFlatFiles = async (menu: any[]): Promise<string[]> => {
    const varNameArr: string[] = [];
    for (const item of menu) {
        if (item.children) {
            const childVarNames = await extractTestVarNamesFlatFiles(item.children);
            varNameArr.push(...childVarNames);
        } else if (item.var_name) {
            varNameArr.push(item.var_name);
        }
    }
    return varNameArr;
};

export const extractVarNames = async (): Promise<void> => {
    const response = await fetchPastEnslavedServiceData();
    const data = response.data;
    return data;
};

