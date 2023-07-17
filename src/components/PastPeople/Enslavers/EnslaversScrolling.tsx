import { Grid, Hidden } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ButtonNav } from '@/styleMUI';
import {
  getColorBTNBackgroundEnslavers,
  getColorBoxShadowEnslavers,
} from '@/utils/functions/getColorStyle';
import EnslaversPage from './EnslaversPage';
import EnslaversTable from './EnslaversTable';
import '@/style/page.scss';

const EnslaversScrolling = () => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleDataSetCollection
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const blocksPeople = ['Intro', 'Table'];

  const handlePageNavigation = (page: number) => {
    dispatch(setCurrentEnslavedPage(page));
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
      {currentEnslavedPage === 1 && <EnslaversPage />}
      {currentEnslavedPage === 2 && <EnslaversTable />}
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
    topPosition = 227;
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
                  style={{
                    width: '80px',
                    height: '32',
                    boxShadow: getColorBoxShadowEnslavers(styleNamePeople),
                    backgroundColor:
                      getColorBTNBackgroundEnslavers(styleNamePeople),
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

export default EnslaversScrolling;

const pageVariantsFromTop = {
  initial: { opacity: 0, y: -1000 },
  animate: { opacity: 1, y: 0 },
};
const pageVariantsFromBottom = {
  initial: { opacity: -1000, y: 0 },
  animate: { opacity: 0, y: 1 },
};
