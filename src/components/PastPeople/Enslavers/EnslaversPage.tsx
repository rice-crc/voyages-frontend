import { Box, Grid } from '@mui/material';
import '@/style/page-past.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  BaseFilter,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import {
  setBaseFilterPeopleDataKey,
  setBaseFilterPeopleDataSetValue,
  setBaseFilterPeopleDataValue,
  setDataSetPeopleHeader,
  setPeopleBlocksMenuList,
  setPeopleStyleName,
  setPeopleTextIntro,
} from '@/redux/getPeopleDataSetCollectionSlice';

const EnslaversPage = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { value, textIntroduce } = useSelector(
    (state: RootState) => state.getPeopleDataSetCollection
  );
  const dispatch: AppDispatch = useDispatch();
  const handleSelectEnslavedDataset = (
    base_filter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[]
  ) => {
    for (const base of base_filter) {
      dispatch(setBaseFilterPeopleDataKey(base.var_name));
      dispatch(setBaseFilterPeopleDataValue(base.value));
    }
    dispatch(setBaseFilterPeopleDataSetValue(base_filter));
    dispatch(setDataSetPeopleHeader(textHeder));
    dispatch(setPeopleTextIntro(textIntro));
    dispatch(setPeopleStyleName(styleName));
    dispatch(setPeopleBlocksMenuList(blocks));
  };
  return (
    <>
      <div className="page" id="main-enslavers-home">
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} className="grid-enslaved-introduction">
              <div>Enslaver Intro</div>
              <div className="btn-enslave-box"></div>
            </Grid>
          </Grid>
        </Box>

        <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
      </div>
    </>
  );
};

export default EnslaversPage;
