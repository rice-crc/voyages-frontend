import { Toolbar, Hidden } from '@mui/material';
import { CanscandingMenuProps } from '@/share/InterfaceTypes';
import { MenuListsDropdown } from './MenuListsDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ResetAllButton } from '../ButtonComponents/ResetAllButton';
import { resetAllStateToInitailState } from '@/redux/resetAllSlice';

export default function CanscandingMenu(props: CanscandingMenuProps) {
  const dispatch: AppDispatch = useDispatch();
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );
  const handleResetAll = () => {
    dispatch(resetAllStateToInitailState())
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      if (key === 'filterObject') {
        localStorage.removeItem(key);
      }
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        bottom: 12,
      }}
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
    </div>
  );
}
