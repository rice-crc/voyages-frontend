import { Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ButtonNav } from '@/styleMUI';
import {
  getColorBTNBackgroundEnslavers,
  getColorBoxShadowEnslavers,
} from '@/utils/functions/getColorStyle';
import '@/style/page.scss';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import { ENSALVERSPAGE, PASTHOMEPAGE } from '@/share/CONST_DATA';
import { useNavigate } from 'react-router-dom';
import { setIsFilter } from '@/redux/getFilterSlice';

const CollectionTabEnslavers = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
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

  return (
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
                  width: '70px',
                  boxShadow: getColorBoxShadowEnslavers(styleNamePeople),
                  backgroundColor:
                    getColorBTNBackgroundEnslavers(styleNamePeople),
                  fontSize: 14,
                  color:
                    currentEnslaversPage === buttonIndex ? 'white' : 'black',
                  fontWeight: currentEnslaversPage === buttonIndex ? 900 : 600,
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
  );
};

export default CollectionTabEnslavers;
