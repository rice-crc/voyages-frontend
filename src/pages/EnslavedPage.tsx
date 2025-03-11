import HeaderEnslavedNavBar from '@/components/NavigationComponents/Header/HeaderEnslavedNavBar';
import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import '@/style/page-past.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import CollectionTabEnslaved from '@/components/NavigationComponents/CollectionTab/CollectionTabEnslaved';
import EnslavedMap from '@/components/PresentationComponents/Map/MAPS';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  setPeopleEnslavedBlocksMenuList,
  setPeopleEnslavedFilterMenuFlatfile,
  setPeopleEnslavedStyleName, setPeopleTableEnslavedFlatfile
} from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import {
  setCurrentBlockName,
  setCurrentEnslavedPage
} from '@/redux/getScrollEnslavedPageSlice';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/people/people_collections.json';
import Tables from '@/components/PresentationComponents/Tables/Tables';
import { AFRICANORIGINS, ALLENSLAVED, ENSLAVEDTEXAS } from '@/share/CONST_DATA';
import { setCardFileName } from '@/redux/getCardFlatObjectSlice';

const EnslavedPage: React.FC = () => {
  const { styleName, currentBlockName } = usePageRouter();
  const dispatch: AppDispatch = useDispatch();
  const { currentEnslavedPage, currentPageBlockName } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  useEffect(() => {
    if (styleName) {
      dispatch(setPeopleEnslavedStyleName(styleName));
    }
    if (styleName === AFRICANORIGINS) {
      dispatch(setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[0].blocks));
      dispatch(setCardFileName(jsonDataPEOPLECOLLECTIONS[0].card_flatfile));
      dispatch(setPeopleEnslavedFilterMenuFlatfile(jsonDataPEOPLECOLLECTIONS[0].filter_menu_flatfile));
      dispatch(setPeopleTableEnslavedFlatfile(jsonDataPEOPLECOLLECTIONS[0].table_flatfile));
    } else if (styleName === ENSLAVEDTEXAS) {
      dispatch(setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[1].blocks));
      dispatch(setCardFileName(jsonDataPEOPLECOLLECTIONS[1].card_flatfile));
      dispatch(setPeopleEnslavedFilterMenuFlatfile(jsonDataPEOPLECOLLECTIONS[1].filter_menu_flatfile));
      dispatch(setPeopleTableEnslavedFlatfile(jsonDataPEOPLECOLLECTIONS[1].table_flatfile));
    } else if (styleName === ALLENSLAVED) {
      dispatch(setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[2].blocks));
      dispatch(setCardFileName(jsonDataPEOPLECOLLECTIONS[2].card_flatfile));
      dispatch(setPeopleEnslavedFilterMenuFlatfile(jsonDataPEOPLECOLLECTIONS[2].filter_menu_flatfile));
      dispatch(setPeopleTableEnslavedFlatfile(jsonDataPEOPLECOLLECTIONS[2].table_flatfile));
    }
    if (currentBlockName === 'people') {
      dispatch(setCurrentEnslavedPage(1));
      dispatch(setCurrentBlockName(currentBlockName));
    } else if (currentBlockName === 'map') {
      dispatch(setCurrentEnslavedPage(2));
      dispatch(setCurrentBlockName(currentBlockName));
      dispatch(
        setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[1].blocks)
      );
    }
  }, [styleName, currentBlockName, currentEnslavedPage, currentPageBlockName]);

  const displayPage = (
    <motion.div
      initial={'initial'}
      animate={'animate'}
      variants={
        currentEnslavedPage - 1 > -1
          ? pageVariantsFromTop
          : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {currentEnslavedPage === 1 && currentPageBlockName === 'people' && (
        <Tables />
      )}
      {currentEnslavedPage === 2 && currentPageBlockName === 'map' && (
        <EnslavedMap />
      )}
    </motion.div>
  );
  const headerHeight = 80
  return (
    <div className="flex flex-col h-screen">
      <HeaderEnslavedNavBar />
      <div className="flex-1 relative">
        <div
          className="sticky top-0 bg-white z-10 border-b shadow-sm"
          style={{
            top: headerHeight,
          }}
        >
          <CollectionTabEnslaved />
        </div>
        <div
          className="overflow-auto"
          style={{
            height: `calc(100vh - ${headerHeight}px - 200px)`,
            paddingTop: inputSearchValue ? '0.5rem' : '0'
          }}
        >
          <Grid id="content-container">
            <motion.div
              initial="initial"
              animate="animate"
              variants={currentEnslavedPage - 1 > -1 ? pageVariantsFromTop : pageVariantsFromBottom}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {displayPage}
            </motion.div>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default EnslavedPage;
