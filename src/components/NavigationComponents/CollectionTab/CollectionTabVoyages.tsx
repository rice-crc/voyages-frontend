import { Button, Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';

import '@/style/page.scss';
import {
  getColorBTNVoyageDatasetBackground,
  getColorBackground,
  getColorBoxShadow,
  getColorTextCollection,
  getColorHoverBackgroundCollection,
} from '@/utils/functions/getColorStyle';
import { setIsFilter } from '@/redux/getFilterSlice';
import { setPathNameVoyages } from '@/redux/getDataPathNameSlice';
import { ALLVOYAGES } from '@/share/CONST_DATA';
import { useNavigate } from 'react-router-dom';
import { pageVariantsFromTop } from '@/utils/functions/pageVariantsFromTop';

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
            const newBlockName = page.toLowerCase().replace(/\s/g, '');
            const buttonIndex = index + 1;
            return (
              <Button
                key={`${newBlockName}-${buttonIndex}`}
                onClick={() => handlePageNavigation(buttonIndex, newBlockName)}
                className="nav-button-page"
                sx={{
                  margin: '5px',
                  cursor: 'pointer',
                  textTransform: 'unset',
                  backgroundColor: getColorBackground(styleName),
                  boxShadow: currentVoyageBlockName === newBlockName.toLocaleLowerCase() ? getColorBoxShadow(styleName) : '',
                  color: currentVoyageBlockName === newBlockName.toLocaleLowerCase() ? 'white' : getColorTextCollection(styleName),
                  fontWeight: currentVoyageBlockName === newBlockName.toLocaleLowerCase() ? 'bold' : 600,
                  fontSize: '0.80rem',
                  '&:hover': {
                    backgroundColor: getColorHoverBackgroundCollection(styleName!),
                    color: getColorBTNVoyageDatasetBackground(styleName)
                  },
                  '&:disabled': {
                    color: '#fff',
                    boxShadow: getColorBoxShadow(styleName!),
                    cursor: 'not-allowed',
                  },
                }}
                variant={currentPage === buttonIndex ? 'contained' : 'outlined'}
              >
                {page}
              </Button>
            );
          })}
        </nav>
      </div>
    </Hidden>
  );
};

export default CollectionTabVoyages;
