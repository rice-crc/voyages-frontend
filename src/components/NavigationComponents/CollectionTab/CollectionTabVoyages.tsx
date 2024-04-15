import { Button, Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { CurrentPageInitialState, LabelFilterMeneList } from '@/share/InterfaceTypes';

import '@/style/page.scss';
import {
  getColorBTNVoyageDatasetBackground,
  getColorBackground,
  getColorBoxShadow,
  getColorTextCollection,
  getColorHoverBackgroundCollection,
} from '@/utils/functions/getColorStyle';
import { setFilterObject, setIsFilter } from '@/redux/getFilterSlice';
import { setPathNameVoyages } from '@/redux/getDataPathNameSlice';
import { ALLVOYAGES } from '@/share/CONST_DATA';
import { useNavigate } from 'react-router-dom';
import { BlockCollectionProps } from '@/share/InterfactTypesDatasetCollection';

const CollectionTabVoyages = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { styleName, blocks } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);

  const { currentPage, currentVoyageBlockName } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);

  const handlePageNavigation = (page: number, blockName: string) => {
    console.log({ page, blockName })
    dispatch(setCurrentPage(page));
    if (page === 1) {
      dispatch(setIsFilter(false));
    } else if (page === 5) {
      dispatch(setPathNameVoyages(ALLVOYAGES));
    }
    navigate(`#${(blockName).toLowerCase()}`)
    dispatch(setFilterObject(filtersObj));
  };


  return (
    <Hidden>
      <div className="navbar-wrapper">
        <nav className="nav-button">

          {blocks.map((items: any, index: number) => {

            // const { label: page } = items;
            // const blockName = (page as LabelFilterMeneList)[languageValue];
            const blockName = (items as string)
            const newBlockName = items.toLowerCase().replace(/\s/g, '');
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
                {blockName}
              </Button>
            );
          })}
        </nav>
      </div>
    </Hidden>
  );
};

export default CollectionTabVoyages;
