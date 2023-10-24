import { Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ButtonNav } from '@/styleMUI';
import {
  getColorBTNBackgroundEnslaved,
  getColorBoxShadowEnslaved,
} from '@/utils/functions/getColorStyle';
import '@/style/page.scss';
import { setPathName } from '@/redux/getDataPathNameSlice';
import { ALLENSLAVED } from '@/share/CONST_DATA';
import { setIsFilter } from '@/redux/getFilterSlice';

const CollectionTabEnslaved = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleNamePeople, blocksPeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );

  const handlePageNavigation = (page: number) => {
    if (page === 1) {
      dispatch(setIsFilter(false));
    }
    dispatch(setCurrentEnslavedPage(page));
    if (page === 2) {
      dispatch(setPathName(ALLENSLAVED));
    }
  };

  return (
    <Hidden>
      <div className="navbar-wrapper">
        <nav className="nav-button-enslaved">
          {blocksPeople.map((page: string, index: number) => {
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
                  currentEnslavedPage === buttonIndex ? 'contained' : 'outlined'
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

export default CollectionTabEnslaved;
