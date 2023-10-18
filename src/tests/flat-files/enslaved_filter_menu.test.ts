import { expect, test, vi, describe } from "vitest";
import ENSLAVED_FILTER_MENU from '@/utils/flatfiles/enslaved_filter_menu.json';
import { fetchPastEnslavedServiceData } from "@/fetch/pastEnslavedFetch/fetchPastEnslavedServiceData";
import { extractTestVarNamesFlatFiles, } from "@/utils/functions/extractVarNamesTest";

global.fetch = vi.fn()
const fileName = 'enslaved_filter_menu.json';
const EndPoint = '/common/schemas/?schema_name=Enslaved&hierarchical=False'
describe(fileName, () => {
    test.todo('To check ENSLAVED_FILTER_MENU var_name equal to key of enslavedOptions request from API')
})

// Test the enslaved_filter_menu data
test("Test Enslaved Filter Menu should check for missing names a variable", async () => {
    const response = await fetchPastEnslavedServiceData();
    const data = response.data;
    const keyEnslavedOptions = Object.keys(data);
    const varNameArr = await extractTestVarNamesFlatFiles(ENSLAVED_FILTER_MENU);
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
        throw new Error(`Warning: flat file ${fileName} names variables ${missingVarName.join(", ")} that is not present in ${EndPoint}`);
    }
    expect(optionsVarName).not.toEqual([]);
});
