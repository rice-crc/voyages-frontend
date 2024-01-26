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
import { setPathNameVoyages } from '@/redux/getDataPathNameSlice';
import { ALLVOYAGES } from '@/share/CONST_DATA';
import { useNavigate } from 'react-router-dom';
const CollectionTabVoyages = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { styleName, blocks } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { currentPage, currentVoyageBlockName } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const handlePageNavigation = (page: number, blockName: string) => {
    dispatch(setCurrentPage(page));
    if (page === 1) {
      dispatch(setIsFilter(false));
    } else if (page === 5) {
      dispatch(setPathNameVoyages(ALLVOYAGES));
    }
    navigate(`#${(blockName).toLowerCase()}`)
  };

  return (
    <Hidden>
      <div className="navbar-wrapper">
        <nav className="nav-button">
          {blocks.map((page: string, index: number) => {
            const newBlockName = page.replace(/\n/g, '');
            const buttonIndex = index + 1;
            return (
              <ButtonNav
                key={`${newBlockName}-${buttonIndex}`}
                onClick={() => handlePageNavigation(buttonIndex, newBlockName)}
                className="nav-button-page"
                style={{
                  backgroundColor: getColorBackground(styleName),
                  boxShadow: getColorBoxShadow(styleName),
                  color: currentVoyageBlockName === newBlockName.toLocaleLowerCase() ? 'white' : 'black',
                  fontWeight: currentVoyageBlockName === newBlockName.toLocaleLowerCase() ? 700 : 600,
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
