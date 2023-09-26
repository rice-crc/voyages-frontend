import { Grid, Hidden } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';
import { ButtonNav } from '@/styleMUI';
import '@/style/page.scss';
import {
  getColorBackground,
  getColorBoxShadow,
} from '@/utils/functions/getColorStyle';
import VoyagesHompPage from '../../Voyages/VoyagesHompPage';
import Scatter from '../PresentationComponents/Scatter/Scatter';
import BarGraph from '../PresentationComponents/BarGraph/BarGraph';
import PieGraph from '../PresentationComponents/PieGraph/PieGraph';
import VoyagesTable from '../PresentationComponents/Tables/VoyagesTable';
import { setIsFilter } from '@/redux/getFilterSlice';
import VoyagesMaps from '../PresentationComponents/Map/MAPS';
import PivotTables from '../PresentationComponents/PivotTables/PivotTables';
import { setPathName } from '@/redux/getDataPathNameSlice';
import { ALLVOYAGES } from '@/share/CONST_DATA';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';

const VoyagesScrollPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { styleName, blocks } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const handlePageNavigation = (page: number) => {
    dispatch(setCurrentPage(page));
    if (page === 1) {
      dispatch(setIsFilter(false));
    } else if (page === 5) {
      dispatch(setPathName(ALLVOYAGES));
    }
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
      {currentPage === 2 && <VoyagesTable />}
      {currentPage === 3 && <Scatter />}
      {currentPage === 4 && <BarGraph />}
      {currentPage === 5 && <PieGraph />}
      {currentPage === 6 && <PivotTables />}
      {currentPage === 7 && <VoyagesMaps />}
    </motion.div>
  );
  let topPosition;
  if (currentPage === 1) {
    topPosition = 100;
  } else if (currentPage === 2 && isFilter) {
    topPosition = 225;
  } else if (currentPage === 2) {
    topPosition = 170;
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

export default VoyagesScrollPage;
