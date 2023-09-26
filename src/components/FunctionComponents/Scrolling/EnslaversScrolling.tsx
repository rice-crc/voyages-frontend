import { Grid, Hidden } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ButtonNav } from '@/styleMUI';
import {
  getColorBTNBackgroundEnslavers,
  getColorBoxShadowEnslavers,
} from '@/utils/functions/getColorStyle';
import EnslaversPage from '../../PastPeople/EnslaversPage';
import EnslaversTable from '../PresentationComponents/Tables/EnslaversTable';
import '@/style/page.scss';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import { ENSALVERSPAGE, PASTHOMEPAGE } from '@/share/CONST_DATA';
import { useNavigate } from 'react-router-dom';
import { setIsFilter } from '@/redux/getFilterSlice';
import {
  pageVariantsFromBottom,
  pageVariantsFromTop,
} from '@/utils/functions/pageVariantsFromTop';

const EnslaversScrolling = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { styleNamePeople, blocksPeople } = useSelector(
    (state: RootState) => state.getEnslaverDataSetCollections
  );
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );

  const handlePageNavigation = (page: number) => {
    dispatch(setCurrentEnslaversPage(page));
    if (page === 1) {
      dispatch(setIsFilter(false));
    } else if (page === 2) {
      navigate(`/${PASTHOMEPAGE}${ENSALVERSPAGE}`);
    }
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
    topPosition = 170;
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