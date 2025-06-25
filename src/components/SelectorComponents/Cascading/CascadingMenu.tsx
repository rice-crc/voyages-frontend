import { useEffect } from 'react';

import { Toolbar, Hidden } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import SaveSearchComponent from '@/components/FilterComponents/SaveSearchComponent/SaveSearchComponent';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setPeopleEnslavedBlocksMenuList } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import { setViewAll } from '@/redux/getShowFilterObjectSlice';
import { resetAllStateToInitailState } from '@/redux/resetAllSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { VOYAGE } from '@/share/CONST_DATA';
import { TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/people/people_collections.json';

import { MenuListsDropdown } from './MenuListsDropdown';
import { ResetAllButton } from '../ButtonComponents/ResetAllButton';
import { ViewAllButton } from '../ButtonComponents/ViewAllButton';
import '@/style/Nav.scss';
import ShowFilterObject from '../ShowFilterObject/ShowFilterObject';

export default function CascadingMenu() {
  const dispatch: AppDispatch = useDispatch();
  const { varName } = useSelector((state: RootState) => state.rangeSlider);
  const { currentBlockName } = usePageRouter();
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );
  const { styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection,
  );
  const { viewAll } = useSelector(
    (state: RootState) => state.getShowFilterObject,
  );

  useEffect(() => {
    if (
      currentBlockName === 'table' &&
      styleNamePeople === TYPESOFDATASETPEOPLE.africanOrigins
    ) {
      dispatch(
        setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[1].blocks),
      );
    }
  }, [dispatch, styleNamePeople, currentBlockName]);

  const handleResetAll = () => {
    dispatch(resetAllStateToInitailState());
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      if (key === 'filterObject') {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('saveSearchID');
    localStorage.removeItem('visibleColumns');
    window.location.reload();
  };

  const handleViewAll = () => {
    dispatch(setViewAll(!viewAll));
  };

  return (
    <>
      <div className="list-filter-menu-bar">
        <Toolbar
          sx={{
            '@media (min-width: 600px)': {
              minHeight: '40px',
            },
          }}
        >
          <Hidden smDown>
            <div className="list-filter-menu">
              <MenuListsDropdown />
              <ViewAllButton
                varName={varName}
                clusterNodeKeyVariable={clusterNodeKeyVariable}
                clusterNodeValue={clusterNodeValue}
                handleViewAll={handleViewAll}
              />
              <ResetAllButton
                varName={varName}
                clusterNodeKeyVariable={clusterNodeKeyVariable}
                clusterNodeValue={clusterNodeValue}
                handleResetAll={handleResetAll}
              />
            </div>
          </Hidden>
        </Toolbar>
        {(currentBlockName === '' ||
          currentBlockName === VOYAGE ||
          currentBlockName === 'people') && <SaveSearchComponent />}
      </div>
      <div className={`panel-list-unshow${viewAll ? '-show' : ''}`}>
        <ShowFilterObject ariaExpanded={false} handleViewAll={handleViewAll} />
      </div>
    </>
  );
}
