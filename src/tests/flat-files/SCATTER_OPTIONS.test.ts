import { fetchVoyagesOptionsApi } from '@/fetch/voyagesFetch/fetchVoyagesOptionsApi';
import dataVoyageScatterOptions from "@/utils/flatfiles/VOYAGE_SCATTER_OPTIONS.json";
import { expect, test, vi, describe } from "vitest";

const fileName = 'VOYAGE_SCATTER_OPTIONS.json';
global.fetch = vi.fn()
const EndPoint = '/voyage/groupby/'

describe('Voyages SCATTER_OPTIONS API Service', () => {
    test.todo('makes a SCATTER_OPTIONS request to fetch data list')
})

// Test the Options API data
test('VOYAGE_SCATTER_OPTIONS response data matches expected data', async () => {
    const asyncMock = vi.fn().mockResolvedValue(fetchVoyagesOptionsApi())

    const response = await asyncMock();

    const data = response.data;

    const options = Object.keys(data);

    // Compare var_name in options with the values in your JSON file
    dataVoyageScatterOptions.x_vars.forEach((xVar) => {
        expect(options).toContain(xVar.var_name);
    });

    dataVoyageScatterOptions.y_vars.forEach((yVar) => {
        expect(options).toContain(yVar.var_name);
    });

});



// Test the Options if data does not match with API data
test('Test the VOYAGE_SCATTER_OPTIONS if data does not match with API data', async () => {
    const asyncMock = vi.fn().mockResolvedValue(fetchVoyagesOptionsApi())

    const response = await asyncMock();

    const data = response.data;

    const options = Object.keys(data);

    const missingXVars = dataVoyageScatterOptions.x_vars.filter(
        (xVar) => !options.includes(xVar.var_name)
    );
    const missingYVars = dataVoyageScatterOptions.y_vars.filter(
        (yVar) => !options.includes(yVar.var_name)
    );

    const errorMessage = `Missing VOYAGE_SCATTER_OPTIONS.json: flat file ${fileName} names variables:\n\n :${missingXVars.map((xVar) => xVar.var_name).concat(missingYVars.map((yVar) => yVar.var_name).join(', \n'))}\n\nthat is not present in ${EndPoint}`

    if (missingXVars.length + missingYVars.length > 0) {
        throw new Error(errorMessage);
    }
});