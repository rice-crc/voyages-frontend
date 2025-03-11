import { fetchVoyagesOptionsApi } from '@/fetch/voyagesFetch/fetchVoyagesOptionsApi';
import dataVoyagePieOptions from '@/utils/flatfiles/voyages/voyages_piechart_options.json';
import { expect, test, vi, describe } from 'vitest';

const fileName = 'voyages_piechart_options.json';
global.fetch = vi.fn();
const EndPoint = '/voyage/groupby/';

describe('Voyages PIECHART_OPTIONS API Service', () => {
  test.todo('makes a PIECHART_OPTIONS request to fetch data list');
});

// Test the Options API data
test('PIECHART_OPTIONS response data matches expected data', async () => {
  const asyncMock = vi.fn().mockResolvedValue(fetchVoyagesOptionsApi());

  const response = await asyncMock();

  const data = response.data;

  const options = Object.keys(data);

  // Compare var_name in options with the values in your JSON file
  dataVoyagePieOptions.x_vars.forEach((xVar) => {
    expect(options).toContain(xVar.var_name);
  });

  dataVoyagePieOptions.y_vars.forEach((yVar) => {
    expect(options).toContain(yVar.var_name);
  });
});

// Test the Options if data does not match with API data
test('Test the PIECHART_OPTIONS if data does not match with API data', async () => {
  const asyncMock = vi.fn().mockResolvedValue(fetchVoyagesOptionsApi());

  const response = await asyncMock();

  const data = response.data;

  const options = Object.keys(data);

  const missingXVars = dataVoyagePieOptions.x_vars.filter(
    (xVar) => !options.includes(xVar.var_name)
  );
  const missingYVars = dataVoyagePieOptions.y_vars.filter(
    (yVar) => !options.includes(yVar.var_name)
  );

  const errorMessage = `Missing PIECHART_OPTIONS.json: flat file ${fileName} names variables:\n\n :${missingXVars
    .map((xVar) => xVar.var_name)
    .concat(
      missingYVars.map((yVar) => yVar.var_name).join(', \n')
    )}\n\nthat is not present in ${EndPoint}`;

  if (missingXVars.length + missingYVars.length > 0) {
    throw new Error(errorMessage);
  }
});
