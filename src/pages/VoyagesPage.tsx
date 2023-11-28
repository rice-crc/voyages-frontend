import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';
import '@/style/page.scss';
import jsonDataVoyageCollection from '@/utils/flatfiles/VOYAGE_COLLECTIONS.json';
import { getColorVoyagePageBackground } from '@/utils/functions/getColorStyle';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import HeaderVoyagesNavBar from '@/components/NavigationComponents/Header/HeaderVoyagesNavBar';
import VoyagesIntro from '@/components/PresentationComponents/Intro/VoyagesIntro';
import Scatter from '@/components/PresentationComponents/Scatter/Scatter';
import BarGraph from '@/components/PresentationComponents/BarGraph/BarGraph';
import PieGraph from '@/components/PresentationComponents/PieGraph/PieGraph';
import PivotTables from '@/components/PresentationComponents/PivotTables/PivotTables';
import VoyagesMaps from '@/components/PresentationComponents/Map/MAPS';
import CollectionTabVoyages from '@/components/NavigationComponents/CollectionTab/CollectionTabVoyages';
import { useEffect } from 'react';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  setBaseFilterDataKey,
  setBaseFilterDataValue,
  setBlocksMenuList,
  setStyleName,
} from '@/redux/getDataSetCollectionSlice';
import {
  setCurrentPage,
  setCurrentVoyagesBlockName,
} from '@/redux/getScrollPageSlice';
import { INTRAAMERICAN, TRANSATLANTIC, VOYAGESTEXAS } from '@/share/CONST_DATA';
import Tables from '@/components/PresentationComponents/Tables/Tables';
import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';

const VoyagesPage = () => {
  const { styleName: styleVoyagesName, currentBlockName } = usePageRouter();

  const dispatch: AppDispatch = useDispatch();
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { currentPage, currentVoyageBlockName } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { dataSetKey, dataSetValue } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  useEffect(() => {
    if (styleVoyagesName) {
      dispatch(setStyleName(styleVoyagesName));
    }
    const setBaseFilterDataForStyle = (index: number) => {
      if (
        jsonDataVoyageCollection[index]?.base_filter &&
        jsonDataVoyageCollection[index]?.base_filter[0]
      ) {
        dispatch(
          setBaseFilterDataKey(
            jsonDataVoyageCollection[index].base_filter[0].var_name!
          )
        );
        dispatch(
          setBaseFilterDataValue(
            jsonDataVoyageCollection[index].base_filter[0].value!
          )
        );
      }
    };

    if (styleVoyagesName === INTRAAMERICAN) {
      setBaseFilterDataForStyle(1);
    } else if (styleVoyagesName === TRANSATLANTIC) {
      setBaseFilterDataForStyle(2);
    } else if (styleVoyagesName === VOYAGESTEXAS) {
      setBaseFilterDataForStyle(3);
    }

    if (styleVoyagesName === INTRAAMERICAN) {
      dispatch(setBlocksMenuList(jsonDataVoyageCollection[1].blocks));
    } else if (styleVoyagesName === VOYAGESTEXAS) {
      dispatch(setBlocksMenuList(jsonDataVoyageCollection[3].blocks));
    }

    if (styleVoyagesName === INTRAAMERICAN && currentBlockName === 'pie') {
      dispatch(setCurrentVoyagesBlockName('intro'));
    } else if (styleVoyagesName === VOYAGESTEXAS && currentBlockName === 'pie') {
      dispatch(setCurrentVoyagesBlockName('intro'));
    }

    if (currentBlockName === 'intro') {
      dispatch(setCurrentPage(1));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if (currentBlockName === 'voyages') {
      dispatch(setCurrentPage(2));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if (currentBlockName === 'line') {
      dispatch(setCurrentPage(3));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if (currentBlockName === 'bar') {
      dispatch(setCurrentPage(4));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if (currentBlockName === 'pie') {
      dispatch(setCurrentPage(5));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if (currentBlockName === 'table') {
      dispatch(setCurrentPage(6));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if (currentBlockName === 'map') {
      dispatch(setCurrentPage(7));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    }
  }, [
    styleVoyagesName,
    jsonDataVoyageCollection,
    styleName,
    currentBlockName,
    currentPage,
    currentVoyageBlockName,
    dataSetKey,
    dataSetValue,
  ]);

  const displayPage = (
    <motion.div
      initial={'initial'}
      animate={'animate'}
      variants={
        currentPage - 1 > -1 ? pageVariantsFromTop : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {currentPage === 1 && currentVoyageBlockName === 'intro' && (
        <VoyagesIntro />
      )}
      {/* {currentPage === 2 && currentVoyageBlockName === 'voyages' && <VoyagesTable />} */}
      {currentPage === 2 && currentVoyageBlockName === 'voyages' && <Tables />}
      {currentPage === 3 && currentVoyageBlockName === 'line' && <Scatter />}
      {currentPage === 4 && currentVoyageBlockName === 'bar' && <BarGraph />}
      {currentPage === 5 && currentVoyageBlockName === 'pie' && <PieGraph />}
      {currentPage === 6 && currentVoyageBlockName === 'table' && (
        <PivotTables />
      )}
      {currentPage === 7 && currentVoyageBlockName === 'map' && <VoyagesMaps />}
    </motion.div>
  );
  const topPosition = createTopPositionVoyages(currentPage, inputSearchValue);
  return (
    <>
      <HeaderVoyagesNavBar />
      <div
        className="voyages-home-page"
        id="content-container"
        style={{
          backgroundColor: getColorVoyagePageBackground(
            styleVoyagesName!,
            currentPage
          ),
          position: 'relative',
          top: currentPage === 1 ? -40 : !inputSearchValue ? topPosition - 80 : 0,
          padding: currentPage !== 1 ? '30px' : '',
        }}
      >
        <CollectionTabVoyages />
        <Grid id="content-container">{displayPage}</Grid>
      </div>
    </>
  );
};

export default VoyagesPage;
