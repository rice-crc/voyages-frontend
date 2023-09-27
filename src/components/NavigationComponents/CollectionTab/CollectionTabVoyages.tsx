import { Hidden } from '@mui/material';
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
import { setIsFilter } from '@/redux/getFilterSlice';
import { setPathName } from '@/redux/getDataPathNameSlice';
import { ALLVOYAGES } from '@/share/CONST_DATA';
const CollectionTabVoyages = () => {
  const dispatch: AppDispatch = useDispatch();
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
  return (
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
                variant={currentPage === buttonIndex ? 'contained' : 'outlined'}
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

export default CollectionTabVoyages;
