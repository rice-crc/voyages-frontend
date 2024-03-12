import { Toolbar, Hidden } from '@mui/material';
import { CanscandingMenuProps, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import { MenuListsDropdown } from './MenuListsDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ResetAllButton } from '../ButtonComponents/ResetAllButton';
import { resetAllStateToInitailState } from '@/redux/resetAllSlice';
import { usePageRouter } from '@/hooks/usePageRouter';
import { useEffect } from 'react';
import { setPeopleEnslavedBlocksMenuList } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/PEOPLE_COLLECTIONS.json';
import SaveSearchComponent from '@/components/FilterComponents/SaveSearchComponent/SaveSearchComponent';
import '@/style/Nav.scss'
import { VOYAGE } from '@/share/CONST_DATA';

export default function CanscandingMenu(props: CanscandingMenuProps) {
  const dispatch: AppDispatch = useDispatch();
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider
  );
  const { currentBlockName } = usePageRouter();
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );
  const { styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );

  useEffect(() => {

    if (currentBlockName === 'table' && styleNamePeople === TYPESOFDATASETPEOPLE.africanOrigins) {
      dispatch(setPeopleEnslavedBlocksMenuList(jsonDataPEOPLECOLLECTIONS[1].blocks));
    }

  }, [styleNamePeople, currentBlockName,]);

  const handleResetAll = () => {
    dispatch(resetAllStateToInitailState())
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      if (key === 'filterObject') {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('saveSearchID');
  };


  return (
    <div className='list-filter-menu-bar'
    >
      <Toolbar
        sx={{
          '@media (min-width: 600px)': {
            minHeight: '40px',
          },
        }}
      >
        <Hidden smDown>
          <div className='list-filter-menu'>
            <MenuListsDropdown />
            <ResetAllButton varName={varName} clusterNodeKeyVariable={clusterNodeKeyVariable} clusterNodeValue={clusterNodeValue} handleResetAll={handleResetAll} />
          </div>
        </Hidden>
      </Toolbar>
      {(currentBlockName === VOYAGE || currentBlockName === 'people') && <SaveSearchComponent />}
    </div>
  );
}
