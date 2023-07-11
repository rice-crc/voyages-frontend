import { Toolbar, Hidden } from '@mui/material';
import { MenuListDropdown } from './MenuListDropdown';
import { CanscandingMenuProps } from '@/share/InterfaceTypes';

export default function CanscandingMenu(props: CanscandingMenuProps) {
  return (
    <div
      style={{
        position: 'relative',
        bottom: 12,
      }}
    >
      <Toolbar>
        <Hidden smDown>
          <MenuListDropdown />
        </Hidden>
      </Toolbar>
    </div>
  );
}
