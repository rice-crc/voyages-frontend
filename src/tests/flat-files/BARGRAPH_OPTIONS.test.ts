import { fetchVoyagesOptionsApi } from '@/fetch/voyagesFetch/fetchVoyagesOptionsApi';
import dataVoyageBarGraphOptions from "@/utils/flatfiles/voyages/voyages_bargraph_options.json";
import { expect, test, vi, describe } from "vitest";
const fileName = 'voyages_bargraph_options.json';
global.fetch = vi.fn()
const EndPoint = '/voyage/groupby/'
describe('voyages_bargraph_options.json API Service', () => {
    test.todo('makes a voyages_bargraph_options.json request to fetch data list')
})

// Test the voyages_bargraph_options.json API data
test('voyages_bargraph_options.json response data matches expected data', async () => {
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


    const options = Object.keys(data);

    const missingXVars = dataVoyageBarGraphOptions.x_vars.filter(
        (xVar) => !options.includes(xVar.var_name)
    );
    const missingYVars = dataVoyageBarGraphOptions.y_vars.filter(
        (yVar) => !options.includes(yVar.var_name)
    );


    const errorMessage = `Missing voyages_bargraph_options.json: flat file ${fileName} names variables:\n\n ${missingXVars.map((xVar) => xVar.var_name).concat(missingYVars.map((yVar) => yVar.var_name).join(', \n'))}\n\nthat is not present in ${EndPoint}`

    if (missingXVars.length + missingYVars.length > 0) {
        throw new Error(errorMessage);
    }
}, 10000); // Set a timeout of 10 seconds (10000ms)
