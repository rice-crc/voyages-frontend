import { expect, test, vi, describe } from "vitest";
import TransatlanticVoyages_FILTER_MENU from '@/utils/flatfiles/voyages/voyages_transatlantic_filter_menu.json';
import { extractTestVarNamesFlatFiles } from "@/utils/functions/extractVarNamesTest";
import { fetchVoyagesOptionsApi } from "@/fetch/voyagesFetch/fetchVoyagesOptionsApi";

const fileName = 'voyages_transatlantic_filter_menu.json';
const EndPoint = '/common/schemas/?schema_name=Voyage&hierarchical=False'
global.fetch = vi.fn();
describe(fileName, () => {
    test.todo('To check TransatlanticVoyages_FILTER_MENU var_name equal to key of enslavedOptions request from API')
})


test("Transatlantic Voyages Filter Menu should check for missing names a variable", async () => {
    const response = await fetchVoyagesOptionsApi();
    const data = response.data;
    const keyEnslavedOptions = Object.keys(data);
    const varNameArr = await extractTestVarNamesFlatFiles(TransatlanticVoyages_FILTER_MENU);
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
});
