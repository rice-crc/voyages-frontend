import { Button, Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentBlockName, setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import {
  getColorBTNBackgroundEnslaved,
  getColorBTNVoyageDatasetBackground,
  getColorBoxShadowEnslaved,
  getColorTextCollection,
  getColorHoverBackgroundCollection,
} from '@/utils/functions/getColorStyle';
import '@/style/page.scss';
import { setPathNameEnslaved } from '@/redux/getDataPathNameSlice';
import { AFRICANORIGINS, ALLENSLAVED, } from '@/share/CONST_DATA';
import { setIsFilter } from '@/redux/getFilterSlice';
import { useNavigate } from 'react-router-dom';
import { usePageRouter } from '@/hooks/usePageRouter';
import { useEffect } from 'react';
import { setPeopleEnslavedBlocksMenuList, } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/PEOPLE_COLLECTIONS.json';
import { TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';

const CollectionTabEnslaved = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { blocksPeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  const { styleName, currentBlockName } = usePageRouter();
  const { currentEnslavedPage, currentPageBlockName } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );


  useEffect(() => {
    if (currentBlockName === 'table' && styleName === TYPESOFDATASETPEOPLE.africanOrigins) {
      dispatch(setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[1].blocks));
    }

  }, [styleName, currentBlockName,]);


  const handlePageNavigation = (page: number, blockName: string) => {

    if (page === 1) {
      dispatch(setIsFilter(false));
    }
    dispatch(setCurrentEnslavedPage(page));
    dispatch(setCurrentBlockName(blockName))
    if (page === 2) {
      dispatch(setPathNameEnslaved(ALLENSLAVED));
    }
    navigate(`#${(blockName).toLowerCase()}`)
  };

  return (
    <Hidden>
      <div className="navbar-wrapper">
        <nav className="nav-button-enslaved">
          {blocksPeople.map((page: string, index: number) => {
            const buttonIndex = index + 1;
            return (

              <Button
                key={`${page}-${buttonIndex}`}
                onClick={() => handlePageNavigation(buttonIndex, page.toLowerCase())}
                className="nav-button-page"
                sx={{
                  width: 75,
                  margin: '5px',
                  cursor: 'pointer',
                  textTransform: 'unset',
                  backgroundColor: getColorBTNBackgroundEnslaved(styleName!),
                  boxShadow: currentPageBlockName === page.toLocaleLowerCase() ? getColorBoxShadowEnslaved(styleName!) : '',
                  color: currentPageBlockName === page.toLocaleLowerCase() ? 'white' : getColorTextCollection(styleName!),
                  fontWeight: currentPageBlockName === page.toLocaleLowerCase() ? 'bold' : 600,
                  fontSize: '0.80rem',
                  '&:hover': {
                    backgroundColor: getColorHoverBackgroundCollection(styleName!!),
                    color: getColorBTNVoyageDatasetBackground(styleName!)
                  },
                  '&:disabled': {
                    color: '#fff',
                    boxShadow: getColorBoxShadowEnslaved(styleName!),
                    cursor: 'not-allowed',
                  },
                }}
                variant={currentEnslavedPage === buttonIndex ? 'contained' : 'outlined'}
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

export default CollectionTabEnslaved;
