import { useEffect, useState } from 'react';
import { Grid, Hidden } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, setIsOpenDialog } from '@/redux/getScrollPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';
import { ButtonNav } from '@/styleMUI';
import '@/style/page.scss';
import {
  getColorBackground,
  getColorBoxShadow,
} from '@/utils/functions/getColorStyle';
import VoyagesHompPage from './Results/VoyagesHompPage';
import Scatter from './Results/Scatter';
import BarGraph from './Results/BarGraph';
import PieGraph from './Results/PieGraph';
import VoyagesTable from './Results/VoyagesTable';
import { setIsFilter } from '@/redux/getFilterSlice';
import VoyagesMaps from '../FunctionComponents/Map/MAPS';
import PivotTables from '../FunctionComponents/PivotTables/PivotTables';
import { setPathName } from '@/redux/getDataPathNameSlice';
import { ALLVOYAGES } from '@/share/CONST_DATA';
import { resetAll } from '@/redux/resetAllSlice';

const ScrollPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { styleName, blocks } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const handlePageNavigation = (page: number) => {
    if (page === 1) {
      dispatch(setIsFilter(false));

      const keysToRemove = Object.keys(localStorage);
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });
    } else if (page === 5) {
      dispatch(setPathName(ALLVOYAGES));
    }
    dispatch(resetAll());
    dispatch(setCurrentPage(page));
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const displayPage = (
    <motion.div
      initial={'initial'}
      animate={'animate'}
      variants={
        currentPage - 1 > -1 ? pageVariantsFromTop : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {currentPage === 1 && <VoyagesHompPage />}
      {currentPage === 2 && <Scatter />}
      {currentPage === 3 && <BarGraph />}
      {currentPage === 4 && <PieGraph />}
      {currentPage === 5 && <VoyagesTable />}
      {currentPage === 6 && <PivotTables />}
      {currentPage === 7 && <VoyagesMaps />}
    </motion.div>
  );
  let topPosition;
  if (currentPage === 1) {
    topPosition = 100;
  } else if (currentPage === 5 && isFilter) {
    topPosition = 225;
  } else if (currentPage === 5) {
    topPosition = 160;
  } else if (currentPage === 7) {
    topPosition = 235;
  } else if (isFilter) {
    topPosition = 227;
  } else {
    topPosition = 170;
  }

  return (
    <div
      style={{
        position: 'relative',
        top: topPosition,
        padding: currentPage !== 1 ? '0 20px' : '',
      }}
      id="content-container"
    >
      <Hidden>
        <div className="navbar-wrapper">
          <nav className="nav-button">
            {blocks.map((page, index) => {
              const buttonIndex = index + 1;
              return (
                <ButtonNav
                  key={`${page}-${buttonIndex}`}
                  onClick={() => handlePageNavigation(buttonIndex)}
                  className="nav-button-page"
                  style={{
                    backgroundColor: getColorBackground(styleName),
                    boxShadow: getColorBoxShadow(styleName),
                    color: currentPage === buttonIndex ? 'white' : 'black',
                    fontWeight: currentPage === buttonIndex ? 900 : 600,
                  }}
                  variant={
                    currentPage === buttonIndex ? 'contained' : 'outlined'
                  }
                >
                  {page.toUpperCase()}
                </ButtonNav>
              );
            })}
          </nav>
        </div>
      </Hidden>
      <Grid id="content-container">{displayPage}</Grid>
    </div>
  );
};

export default ScrollPage;

const pageVariantsFromTop = {
  initial: { opacity: 0, y: -1000 },
  animate: { opacity: 1, y: 0 },
};
const pageVariantsFromBottom = {
  initial: { opacity: -1000, y: 0 },
  animate: { opacity: 0, y: 1 },
};
