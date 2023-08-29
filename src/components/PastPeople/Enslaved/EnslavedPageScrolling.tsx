import { Grid, Hidden } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ButtonNav } from '@/styleMUI';
import {
  getColorBTNBackgroundEnslaved,
  getColorBoxShadowEnslaved,
} from '@/utils/functions/getColorStyle';
import EnslavedPage from './EnslavedPage';
import EnslavedTable from './EnslavedTable';
import '@/style/page.scss';
import VoyagesMaps from '@/components/FunctionComponents/Map/MAPS';
import { setPathName } from '@/redux/getDataSetCollectionSlice';
import { ALLENSLAVED } from '@/share/CONST_DATA';

const EnslavedPageScrolling = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { styleNamePeople, blocksPeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );

  const handlePageNavigation = (page: number) => {
    dispatch(setCurrentEnslavedPage(page));
    if (page === 2) {
      dispatch(setPathName(ALLENSLAVED));
    }
  };

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
      {currentEnslavedPage === 1 && <EnslavedPage />}
      {currentEnslavedPage === 2 && <EnslavedTable />}
      {currentEnslavedPage === 3 && <VoyagesMaps />}
    </motion.div>
  );

  let topPosition;
  if (currentEnslavedPage === 1) {
    topPosition = 100;
  } else if (currentEnslavedPage === 2 && isFilter) {
    topPosition = 225;
  } else if (currentEnslavedPage === 2) {
    topPosition = 160;
  } else if (isFilter) {
    topPosition = 235;
  } else {
    topPosition = 170;
  }
  return (
    <div
      style={{
        position: 'relative',
        top: topPosition,
        padding: currentEnslavedPage !== 1 ? '0 20px' : '',
      }}
      id="content-container"
    >
      <Hidden>
        <div className="navbar-wrapper">
          <nav className="nav-button-enslaved">
            {blocksPeople.map((page, index) => {
              const buttonIndex = index + 1;
              return (
                <ButtonNav
                  key={`${page}-${buttonIndex}`}
                  onClick={() => handlePageNavigation(buttonIndex)}
                  className="nav-button-page"
                  style={{
                    backgroundColor:
                      getColorBTNBackgroundEnslaved(styleNamePeople),
                    boxShadow: getColorBoxShadowEnslaved(styleNamePeople),
                    fontSize: currentEnslavedPage === buttonIndex ? 15 : 14,
                    color:
                      currentEnslavedPage === buttonIndex ? 'white' : 'black',
                    fontWeight: currentEnslavedPage === buttonIndex ? 900 : 600,
                  }}
                  variant={
                    currentEnslavedPage === buttonIndex
                      ? 'contained'
                      : 'outlined'
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

export default EnslavedPageScrolling;

const pageVariantsFromTop = {
  initial: { opacity: 0, y: -1000 },
  animate: { opacity: 1, y: 0 },
};
const pageVariantsFromBottom = {
  initial: { opacity: -1000, y: 0 },
  animate: { opacity: 0, y: 1 },
};
