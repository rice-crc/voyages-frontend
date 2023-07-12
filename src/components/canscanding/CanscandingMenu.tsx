import { Toolbar, Hidden } from '@mui/material';
import { MenuListDropdown } from './MenuListDropdown';
import { CanscandingMenuProps } from '@/share/InterfaceTypes';
import { MenuListDropdownPeople } from './MenuListDropdownPeople';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ALLENSLAVED, ALLVOYAGES } from '@/share/CONST_DATA';

export default function CanscandingMenu(props: CanscandingMenuProps) {
  const { pathName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  return (
    <div
      style={{
        position: 'relative',
        bottom: 12,
      }}
    >
      <Toolbar>
        <Hidden smDown>
          {pathName === ALLVOYAGES && <MenuListDropdown />}
          {pathName === ALLENSLAVED && <MenuListDropdownPeople />}
        </Hidden>
      </Toolbar>
    </div>
  );
}
