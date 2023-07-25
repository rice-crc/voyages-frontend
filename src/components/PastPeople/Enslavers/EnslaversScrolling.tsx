import { Grid, Hidden } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ButtonNav } from '@/styleMUI';
import {
  getColorBTNBackgroundEnslavers,
  getColorBoxShadowEnslavers,
} from '@/utils/functions/getColorStyle';
import EnslaversPage from './EnslaversPage';
import EnslaversTable from './EnslaversTable';
import '@/style/page.scss';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';

const EnslaversScrolling = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { styleNamePeople, blocksPeople } = useSelector(
    (state: RootState) => state.getEnslaverDataSetCollections
  );
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );

  const handlePageNavigation = (page: number) => {
    dispatch(setCurrentEnslaversPage(page));
  };
  const displayPage = (
    <motion.div
      initial={'initial'}
      animate={'animate'}
      variants={
        currentEnslaversPage - 1 > -1
          ? pageVariantsFromTop
          : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {currentEnslaversPage === 1 && <EnslaversPage />}
      {currentEnslaversPage === 2 && <EnslaversTable />}
    </motion.div>
  );

  let topPosition;
  if (currentEnslaversPage === 1) {
    topPosition = 100;
  } else if (currentEnslaversPage === 2 && isFilter) {
    topPosition = 225;
  } else if (currentEnslaversPage === 2) {
    topPosition = 160;
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
        padding: currentEnslaversPage !== 1 ? '0 20px' : '',
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
                  style={{
                    width: '80px',
                    height: '32',
                    boxShadow: getColorBoxShadowEnslavers(styleNamePeople),
                    backgroundColor:
                      getColorBTNBackgroundEnslavers(styleNamePeople),
                    fontSize: currentEnslaversPage === buttonIndex ? 15 : 14,
                    color:
                      currentEnslaversPage === buttonIndex ? 'white' : 'black',
                    fontWeight:
                      currentEnslaversPage === buttonIndex ? 900 : 600,
                  }}
                  variant={
                    currentEnslaversPage === buttonIndex
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

export default EnslaversScrolling;

const pageVariantsFromTop = {
  initial: { opacity: 0, y: -1000 },
  animate: { opacity: 1, y: 0 },
};
const pageVariantsFromBottom = {
  initial: { opacity: -1000, y: 0 },
  animate: { opacity: 0, y: 1 },
};
