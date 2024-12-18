import { test, expect, describe } from 'vitest';
import getDataSetCollectionReducer, {
  initialState,
  setBaseFilterDataSetValue,
  setBlocksMenuList,
  setDataSetHeader,
  setTextIntro,
  setStyleName,
} from '@/redux/getDataSetCollectionSlice';

describe('getDataSetCollectionReducer', () => {
  test.todo('Add more test cases for other reducers');
});

//setBaseFilterDataSetValue
test('setBaseFilterDataSetValue reducer sets the dataSetValueBaseFilter', () => {
  const baseFilter = [{ var_name: 'dataset', value: [1, 1] }];

  const state = getDataSetCollectionReducer(
    initialState,
    setBaseFilterDataSetValue(baseFilter)
  );

  expect(state.dataSetValueBaseFilter).toEqual(baseFilter);
});

//setBlocksMenuList
test('setBlocksMenuList reducer sets the blocks', () => {
  const blocks = ['INTRO', 'SCATTER', 'BAR', 'PIE', 'TABLE', 'PIVOT', 'MAP'];

  const state = getDataSetCollectionReducer(
    initialState,
    setBlocksMenuList(blocks)
  );

  expect(state.blocks).toEqual(blocks);
});

// setBaseFilterDataValue
test('setBaseFilterDataValue reducer sets the blocks', () => {
  const dataSetValue = ['dataset 1', 'dataset 2', 'dataset 3'];

  // const state = getDataSetCollectionReducer(initialState, setBaseFilterDataValue(dataSetValue));

  // expect(state.dataSetValue).toEqual(dataSetValue);
});

//setBaseFilterDataKey
test('setBaseFilterDataKey reducer sets the blocks', () => {
  const dataSetKey = 'dataset';

  // const state = getDataSetCollectionReducer(initialState, setBaseFilterDataKey(dataSetKey));

  // expect(state.dataSetKey).toEqual(dataSetKey);
});

//setDataSetHeader
test('setDataSetHeader reducer sets the blocks', () => {
  const textHeader = 'Intra-american';

  const state = getDataSetCollectionReducer(
    initialState,
    setDataSetHeader(textHeader)
  );

  expect(state.textHeader).toEqual(textHeader);
});

//setTextIntro
test('setDataSetHeader reducer sets the blocks', () => {
  const textIntroduce =
    'The Trans-Atlantic and Intra-American slave trade databases are the culmination of several decades of independent and collaborative research by scholars drawing upon data in libraries and archives around the Atlantic world. The new Slave Voyages website itself is the product of three years of development by a multi-disciplinary team of historians, librarians, curriculum specialists, cartographers, computer programmers, and web designers, in consultation with scholars of the slave trade from universities in Europe, Africa, South America, and North America. The National Endowment for the Humanities was the principal sponsor of this work carried out originally at Emory Center for Digital Scholarship, the University of California at Irvine, and the University of California at Santa Cruz. The Hutchins Center of Harvard University has also provided support. The website is currently hosted at Rice University.';

  const state = getDataSetCollectionReducer(
    initialState,
    setTextIntro(textIntroduce)
  );

  expect(state.textIntroduce).toEqual(textIntroduce);
});

//setStyleName
test('setStyleName reducer sets the blocks', () => {
  const styleName = 'all-voyages';

  const state = getDataSetCollectionReducer(
    initialState,
    setStyleName(styleName)
  );

  expect(state.styleName).toEqual(styleName);
});
