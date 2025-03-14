import { Button, Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentBlockName,
  setCurrentEnslavedPage,
} from '@/redux/getScrollEnslavedPageSlice';
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
import { ALLENSLAVED } from '@/share/CONST_DATA';
import { setFilterObject, setIsFilter } from '@/redux/getFilterSlice';
import { useNavigate } from 'react-router-dom';
import { usePageRouter } from '@/hooks/usePageRouter';
import { useEffect } from 'react';
import { setPeopleEnslavedBlocksMenuList } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/people/people_collections.json';
import {
  LabelFilterMeneList,
  TYPESOFBLOCKENSLAVED,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import { BlockCollectionProps } from '@/share/InterfactTypesDatasetCollection';
import { checkBlockCollectionNameForEnslaved } from '@/utils/functions/checkBlockCollectionName';

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
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );

  useEffect(() => {
    if (
      currentBlockName === 'table' &&
      styleName === TYPESOFDATASETPEOPLE.africanOrigins
    ) {
      dispatch(
        setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[1].blocks)
      );
    }
  }, [styleName, currentBlockName]);

  const handlePageNavigation = (page: number, blockName: string) => {
    if (page === 1) {
      dispatch(setIsFilter(false));
    }
    dispatch(setCurrentEnslavedPage(page));
    dispatch(setCurrentBlockName(blockName));
    if (page === 2) {
      dispatch(setPathNameEnslaved(ALLENSLAVED));
    }
    if (
      checkBlockCollectionNameForEnslaved(blockName) ===
      TYPESOFBLOCKENSLAVED.enslavedEN
    ) {
      navigate(`#${TYPESOFBLOCKENSLAVED.enslavedEN.toLowerCase()}`);
    } else if (
      checkBlockCollectionNameForEnslaved(blockName) ===
      TYPESOFBLOCKENSLAVED.mapEN
    ) {
      navigate(`#${TYPESOFBLOCKENSLAVED.mapEN.toLowerCase()}`);
    }
    dispatch(setFilterObject(filtersObj));
  };

  return (
    <Hidden>
      <div className="navbar-wrapper">
        <nav className="nav-button-enslaved">
          {blocksPeople.map((items: BlockCollectionProps, index: number) => {
            const { label: block } = items;
            const blockName = (block as LabelFilterMeneList)[languageValue];
            const newBlockName = blockName.toLowerCase().replace(/\s/g, '');
            const buttonIndex = index + 1;
            return (
              <Button
                key={`${newBlockName}-${buttonIndex}`}
                onClick={() => handlePageNavigation(buttonIndex, newBlockName)}
                className="nav-button-page"
                sx={{
                  width: 75,
                  margin: '5px',
                  cursor: 'pointer',
                  textTransform: 'unset',
                  backgroundColor: getColorBTNBackgroundEnslaved(styleName!),
                  boxShadow:
                    currentPageBlockName ===
                    checkBlockCollectionNameForEnslaved(
                      newBlockName.toLocaleLowerCase()
                    )
                      ? getColorBoxShadowEnslaved(styleName!)
                      : '',
                  color:
                    currentPageBlockName ===
                    checkBlockCollectionNameForEnslaved(
                      newBlockName.toLocaleLowerCase()
                    )
                      ? 'white'
                      : getColorTextCollection(styleName!),
                  fontWeight:
                    currentPageBlockName ===
                    checkBlockCollectionNameForEnslaved(
                      newBlockName.toLocaleLowerCase()
                    )
                      ? 'bold'
                      : 600,
                  fontSize: '0.80rem',
                  '&:hover': {
                    backgroundColor: getColorHoverBackgroundCollection(
                      styleName!!
                    ),
                    color: getColorBTNVoyageDatasetBackground(styleName!),
                  },
                  '&:disabled': {
                    color: '#fff',
                    boxShadow: getColorBoxShadowEnslaved(styleName!),
                    cursor: 'not-allowed',
                  },
                }}
                variant={
                  currentEnslavedPage === buttonIndex ? 'contained' : 'outlined'
                }
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

export default CollectionTabEnslaved;
