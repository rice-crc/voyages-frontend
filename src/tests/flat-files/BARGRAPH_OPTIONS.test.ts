import { fetchVoyagesOptionsApi } from '@/fetch/voyagesFetch/fetchVoyagesOptionsApi';
import dataVoyageBarGraphOptions from "@/utils/flatfiles/VOYAGE_BARGRAPH_OPTIONS.json";
import { expect, test, vi, describe } from "vitest";
const fileName = 'VOYAGE_BARGRAPH_OPTIONS.json';
global.fetch = vi.fn()
const EndPoint = '/voyage/groupby/'
describe('VOYAGE_BARGRAPH_OPTIONS.json API Service', () => {
    test.todo('makes a VOYAGE_BARGRAPH_OPTIONS.json request to fetch data list')
})

// Test the VOYAGE_BARGRAPH_OPTIONS.json API data
test('VOYAGE_BARGRAPH_OPTIONS.json response data matches expected data', async () => {
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



// Test the VOYAGE_BARGRAPH_OPTIONS.json if data does not match with API data

test('VOYAGE_BARGRAPH_OPTIONS.json response data matches expected data', async () => {
    const asyncMock = vi.fn().mockResolvedValue(fetchVoyagesOptionsApi())

    const response = await asyncMock();
    const data = response.data;
    console.log({ data })

    const options = Object.keys(data);

    const missingXVars = dataVoyageBarGraphOptions.x_vars.filter(
        (xVar) => !options.includes(xVar.var_name)
    );
    const missingYVars = dataVoyageBarGraphOptions.y_vars.filter(
        (yVar) => !options.includes(yVar.var_name)
    );


    const errorMessage = `Missing VOYAGE_BARGRAPH_OPTIONS.json: flat file ${fileName} names variables:\n\n ${missingXVars.map((xVar) => xVar.var_name).concat(missingYVars.map((yVar) => yVar.var_name).join(', \n'))}\n\nthat is not present in ${EndPoint}`

    if (missingXVars.length + missingYVars.length > 0) {
        throw new Error(errorMessage);
    }
}, 10000); // Set a timeout of 10 seconds (10000ms)
