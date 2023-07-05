import TABLE_FLAT from "@/utils/voyage_table_cell_structure__updated21June.json";
import { expect, test, vi, describe } from "vitest";
import getColumnsReducer, {
    initialState,
    setColumnsSelectorTree,
} from "@/redux/getColumnSlice";

global.fetch = vi.fn()

describe('Voyages TABLE_FLAT Service', () => {
    test.todo('makes a TABLE_FLAT request to fetch data list')
})


test("getColumnsSelectorTree reducer sets the valueCells", () => {
    const tableCellStructure = TABLE_FLAT;

    const state = getColumnsReducer(initialState, setColumnsSelectorTree(tableCellStructure));

    expect(state.valueCells).toEqual(tableCellStructure);
});
