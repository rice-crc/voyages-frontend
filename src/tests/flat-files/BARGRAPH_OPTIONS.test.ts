import { fetchVoyagesOptionsApi } from '@/fetch/voyagesFetch/fetchVoyagesOptionsApi';
import dataVoyageBarGraphOptions from "@/utils/flatfiles/VOYAGE_BARGRAPH_OPTIONS.json";
import { expect, test, vi, describe } from "vitest";

global.fetch = vi.fn()

describe('Voyages BARGRAPH_OPTIONS API Service', () => {
    test.todo('makes a BARGRAPH_OPTIONS request to fetch data list')
})

// Test the BARGRAPH_OPTIONS API data
test('BARGRAPH_OPTIONS response data matches expected data', async () => {
    const asyncMock = vi.fn().mockResolvedValue(fetchVoyagesOptionsApi())

    const response = await asyncMock();

    const data = response.data;

    const options = Object.keys(data);

    // Compare var_name in options with the values in your JSON file
    dataVoyageBarGraphOptions.x_vars.forEach((xVar) => {
        expect(options).toContain(xVar.var_name);
    });

    dataVoyageBarGraphOptions.y_vars.forEach((yVar) => {
        expect(options).toContain(yVar.var_name);
    });

});



// Test the BARGRAPH_OPTIONS if data does not match with API data
test('Test the BARGRAPH_OPTIONS if data does not match with API data', async () => {
    const asyncMock = vi.fn().mockResolvedValue(fetchVoyagesOptionsApi())

    const response = await asyncMock();
    const data = response.data;

    const options = Object.keys(data);

    const missingXVars = dataVoyageBarGraphOptions.x_vars.filter(
        (xVar) => !options.includes(xVar.var_name)
    );
    const missingYVars = dataVoyageBarGraphOptions.y_vars.filter(
        (yVar) => !options.includes(yVar.var_name)
    );

    const errorMessage = `Missing BARGRAPH_OPTIONS: ${missingXVars.map((xVar) => xVar.var_name).concat(missingYVars.map((yVar) => yVar.var_name).join(', '))}`

    if (missingXVars.length + missingYVars.length > 0) {
        throw new Error(errorMessage);
    }
});