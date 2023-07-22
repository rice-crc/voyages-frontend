import { expect, test, vi, describe } from "vitest";
import TEXAS_FILTER_MENU from '@/utils/flatfiles/texas_filter_menu.json';
import { fetchPastEnslavedApiService } from "@/fetchAPI/pastEnslavedApi/fetchPastEnslavedOptionsApi";
import { extractTestVarNamesFlatFiles } from "@/utils/functions/extractVarNamesTest";

const fileName = 'texas_filter_menu.json';
const EndPoint = 'past/enslaved/?hierarchical=False'
global.fetch = vi.fn();
describe(fileName, () => {
    test.todo('To check TEXAS_FILTER_MENU var_name equal to key of enslavedOptions request from API')
})


test("Texas Filter Menu should check for missing names a variable", async () => {
    const response = await fetchPastEnslavedApiService();
    const data = response.data;
    const keyEnslavedOptions = Object.keys(data);
    const varNameArr = await extractTestVarNamesFlatFiles(TEXAS_FILTER_MENU);
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
