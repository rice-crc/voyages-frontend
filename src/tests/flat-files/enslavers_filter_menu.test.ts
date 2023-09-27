import { expect, test, vi, describe } from "vitest";
import ENSLAVERS_FILTER_MENU from '@/utils/flatfiles/enslavers_filter_menu.json';
import { extractTestVarNamesFlatFiles } from "@/utils/functions/extractVarNamesTest";
import { fetchPastEnslaversOptions } from "@/fetch/pastEnslaversFetch/fetchPastEnslaversOptions";

const fileName = 'enslavers_filter_menu.json';
const EndPoint = 'past/enslaver/?hierarchical=False'
global.fetch = vi.fn();
describe(fileName, () => {
    test.todo('To ENSLAVERS_FILTER_MENU var_name equal to key of enslavedOptions request from API')
})

// Test the african_origins_filter_menu data
test("Enslavers Filter Menu should check for missing names a variable", async () => {
    const response = await fetchPastEnslaversOptions();
    const data = response.data;
    const keyEnslavedOptions = Object.keys(data);
    const varNameArr = await extractTestVarNamesFlatFiles(ENSLAVERS_FILTER_MENU);
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
