import { Box, Grid } from '@mui/material';
import '@/style/page-past.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  BaseFilter,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import {
  setBaseFilterPeopleEnslavedDataKey,
  setBaseFilterPeopleEnslavedDataSetValue,
  setBaseFilterPeopleEnslavedDataValue,
  setDataSetPeopleEnslavedHeader,
  setPeopleEnslavedBlocksMenuList,
  setPeopleEnslavedStyleName,
  setPeopleEnslavedTextIntro,
} from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import {
  AFRICANORIGINS,
  AFRICANORIGINSPAGE,
  ALLENSLAVEDPAGE,
  ENSALVEDPAGE,
  ENSLAVEDTEXASPAGE,
  PASTHOMEPAGE,
  ENSLAVEDTEXAS,
  ALLENSLAVED,
} from '@/share/CONST_DATA';
import { useNavigate } from 'react-router-dom';

const EnslavedPage = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { value, textIntroduce } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const handleSelectEnslavedDataset = (
    base_filter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[]
  ) => {
    for (const base of base_filter) {
      dispatch(setBaseFilterPeopleEnslavedDataKey(base.var_name));
      dispatch(setBaseFilterPeopleEnslavedDataValue(base.value));
    }
    dispatch(setBaseFilterPeopleEnslavedDataSetValue(base_filter));
    dispatch(setDataSetPeopleEnslavedHeader(textHeder));
    dispatch(setPeopleEnslavedTextIntro(textIntro));
    dispatch(setPeopleEnslavedStyleName(styleName));
    dispatch(setPeopleEnslavedBlocksMenuList(blocks));
    if (styleName === ALLENSLAVED) {
      navigate(`/${PASTHOMEPAGE}${ENSALVEDPAGE}${ALLENSLAVEDPAGE}`);
    } else if (styleName === AFRICANORIGINS) {
      navigate(`/${PASTHOMEPAGE}${ENSALVEDPAGE}${AFRICANORIGINSPAGE}`);
    } else if (styleName === ENSLAVEDTEXAS) {
      navigate(`/${PASTHOMEPAGE}${ENSALVEDPAGE}${ENSLAVEDTEXASPAGE}`);
    }
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };
  return (
    <>
      <div className="page" id="main-enslaved-home">
        <Box>
          <Grid container spacing={2}>
            <Grid className="grid-enslaved-introduction">
              <div className="intro-box">{textIntroduce}</div>
              <div className="btn-enslave-box">
                {value.map((item: DataSetCollectionProps, index: number) => {
                  const { base_filter, headers, style_name, blocks } = item;
                  return (
                    <div
                      onClick={() =>
                        handleSelectEnslavedDataset(
                          base_filter,
                          headers.label,
                          headers.text_introduce,
                          style_name,
                          blocks
                        )
                      }
                      key={`${item}-${index}`}
                      className="enslave-nav-btn"
                    >
                      {headers.label}
                    </div>
                  );
                })}
              </div>
            </Grid>
          </Grid>
        </Box>
        <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
      </div>
    </>
  );
};

export default EnslavedPage;
