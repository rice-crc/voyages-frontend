import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { CurrentPageInitialState, TYPESOFBLOCKVOYAGES } from '@/share/InterfaceTypes';
import '@/style/page.scss';
import jsonDataVoyageCollection from '@/utils/flatfiles/VOYAGE_COLLECTIONS.json';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';
import HeaderVoyagesNavBar from '@/components/NavigationComponents/Header/HeaderVoyagesNavBar';
import Scatter from '@/components/PresentationComponents/Scatter/Scatter';
import BarGraph from '@/components/PresentationComponents/BarGraph/BarGraph';
import PieGraph from '@/components/PresentationComponents/PieGraph/PieGraph';
import PivotTables from '@/components/PresentationComponents/PivotTables/PivotTables';
import VoyagesMaps from '@/components/PresentationComponents/Map/MAPS';
import CollectionTabVoyages from '@/components/NavigationComponents/CollectionTab/CollectionTabVoyages';
import { useEffect } from 'react';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  setBlocksMenuList,
  setStyleName,
} from '@/redux/getDataSetCollectionSlice';
import {
  setCurrentPage,
  setCurrentVoyagesBlockName,
} from '@/redux/getScrollPageSlice';
import { ALLVOYAGES, INTRAAMERICAN, TRANSATLANTIC } from '@/share/CONST_DATA';
import Tables from '@/components/PresentationComponents/Tables/Tables';
import SummaryStatisticsTable from '@/components/PresentationComponents/Tables/SummaryStatisticsTable';
import { setFilterObject } from '@/redux/getFilterSlice';
import { Divider } from 'antd';
import { VoyagesTimelapseMap } from '@/components/PresentationComponents/Map/TimelapseMap';

const VoyagesPage = () => {
  const { styleName: styleVoyagesName, currentBlockName } = usePageRouter();
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { currentPage, currentVoyageBlockName } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  useEffect(() => {
    if (styleVoyagesName) {
      dispatch(setStyleName(styleVoyagesName));
    }

    if (styleVoyagesName === TRANSATLANTIC) {
      dispatch(setBlocksMenuList(jsonDataVoyageCollection[0].blocks));
    } else if (styleVoyagesName === INTRAAMERICAN) {
      dispatch(setBlocksMenuList(jsonDataVoyageCollection[1].blocks));
    } else if (styleVoyagesName === ALLVOYAGES) {
      dispatch(setBlocksMenuList(jsonDataVoyageCollection[2].blocks));
    }

    if (currentBlockName === 'voyages') {
      dispatch(setCurrentPage(1));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if (currentBlockName === 'summarystatistics') {
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
    } else if (styleVoyagesName === ALLVOYAGES && currentBlockName === 'timelapse') {
      dispatch(setCurrentPage(1));
      dispatch(setCurrentVoyagesBlockName('voyages'));
    } else if ((styleVoyagesName === TRANSATLANTIC) && currentBlockName === 'timelapse') {
      dispatch(setCurrentPage(8));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if ((styleVoyagesName === INTRAAMERICAN) && currentBlockName === 'timelapse') {
      dispatch(setCurrentPage(8));
      dispatch(setCurrentVoyagesBlockName(currentBlockName));
    }
  }, [
    styleVoyagesName,
    jsonDataVoyageCollection,
    styleName,
    currentBlockName,
    currentPage,
    currentVoyageBlockName,
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
      {currentPage === 1 && currentVoyageBlockName === TYPESOFBLOCKVOYAGES.voyagesEN && <Tables />}
      {currentPage === 2 && currentVoyageBlockName === TYPESOFBLOCKVOYAGES.summaryStatisticsEN && <SummaryStatisticsTable />}
      {currentPage === 3 && currentVoyageBlockName === TYPESOFBLOCKVOYAGES.lineEN && <Scatter />}
      {currentPage === 4 && currentVoyageBlockName === TYPESOFBLOCKVOYAGES.barEN && <BarGraph />}
      {currentPage === 5 && currentVoyageBlockName === TYPESOFBLOCKVOYAGES.pieEN && <PieGraph />}
      {currentPage === 6 && currentVoyageBlockName === TYPESOFBLOCKVOYAGES.tableEN && (
        <PivotTables />
      )}
      {currentPage === 7 && currentVoyageBlockName === TYPESOFBLOCKVOYAGES.mapEN && <div style={{ padding: 30 }}> <VoyagesMaps /></div>}
      {currentPage === 8 && currentVoyageBlockName === TYPESOFBLOCKVOYAGES.timeLapseEN && <VoyagesTimelapseMap />}
    </motion.div>
  );

  return (
    <div >
      <HeaderVoyagesNavBar />
      <div
        className="voyages-home-page"
        id="content-container"
        style={{
          position: 'relative',
          padding: inputSearchValue ? '0 20px' : '',
          top: inputSearchValue ? 40 : 10
        }}
      >
        <CollectionTabVoyages />
        <Grid id="content-container">{displayPage}</Grid>
      </div>
      <Divider />
    </div>
  );
};

export default VoyagesPage;
