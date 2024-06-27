import { expect, test, vi, describe } from "vitest";
import AFRICAN_FILTER_MENU from '@/utils/flatfiles/enslaved/enslaved_african_origins_filter_menu.json';
import { fetchPastEnslavedServiceData } from "@/fetch/pastEnslavedFetch/fetchPastEnslavedServiceData";
import { extractTestVarNamesFlatFiles } from "@/utils/functions/extractVarNamesTest";

const fileName = 'enslaved/enslaved_african_origins_filter_menu.json';
const EndPoint = '/common/schemas/?schema_name=Enslaved&hierarchical=False'
global.fetch = vi.fn();
describe(fileName, () => {
    test.todo('To check AFRICAN_FILTER_MENU var_name equal to key of enslavedOptions request from API')
})

// Test the african_origins_filter_menu data
test("African Filter Menu should check for missing names a variable", async () => {
    const response = await fetchPastEnslavedServiceData();
    const data = response.data;

    const keyEnslavedOptions = Object.keys(data);
    const varNameArr = await extractTestVarNamesFlatFiles(AFRICAN_FILTER_MENU);
    const missingVarName: string[] = [];
    const optionsVarName: string[] = [];
    for (const key of varNameArr) {
        if (!keyEnslavedOptions.includes(key)) {
            missingVarName.push(key);
        } else {
            optionsVarName.push(key);
        }
    }
    if (missingVarName.length > 0) {
        throw new Error(`Warning: flat file ${fileName} names variables:\n\n${missingVarName.join(",\n")}\n\nthat is not present in ${EndPoint}`);
    }
    expect(optionsVarName).not.toEqual([]);
}, 10000); 
