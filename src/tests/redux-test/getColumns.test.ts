import TABLE_FLAT from "@/utils/voyage_table_cell_structure__updated21June.json";
import { expect, test, vi, describe } from "vitest";
import getColumnsReducer, {
    initialState,
    setColumnsSelectorTree,
    setVisibleColumn,
} from "@/redux/getColumnSlice";

global.fetch = vi.fn()

describe('Voyages ColumnsSelectorTree  Service', () => {
    test.todo('makes a ColumnsSelectorTree request to fetch data list')
})


test("setColumnsSelectorTree reducer sets the valueCells", () => {
    const tableCellStructure = TABLE_FLAT;

    const state = getColumnsReducer(initialState, setColumnsSelectorTree(tableCellStructure));

    expect(state.valueCells).toEqual(tableCellStructure);
});

test("setVisibleColumn reducer sets the valueCells", () => {
    const visibleColumn = [
        "voyage_dates__imp_arrival_at_port_of_dis_sparsedate__year",
        "voyage_itinerary__imp_principal_port_slave_dis__geo_location__name",
        "voyage_enslavers",
        "voyage_ship__vessel_construction_place__geo_location__name"
    ]
    const state = getColumnsReducer(initialState, setVisibleColumn(visibleColumn));

    expect(state.visibleColumnCells).toEqual(visibleColumn);
});
