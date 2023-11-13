import { Toolbar, Hidden } from '@mui/material';
import { MenuListDropdown } from './MenuListDropdown';
import { CanscandingMenuProps } from '@/share/InterfaceTypes';
import { MenuListDropdownPeople } from './MenuListDropdownPeople';
import { AFRICANORIGINS, ALLENSLAVED, ENSALVERSTYLE, ENSLAVEDTEXAS } from '@/share/CONST_DATA';
import { usePageRouter } from '@/hooks/usePageRouter';

export default function CanscandingMenu(props: CanscandingMenuProps) {

  const { styleName } = usePageRouter()

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
          <div>
            {styleName === ALLENSLAVED || styleName === AFRICANORIGINS || styleName === ENSLAVEDTEXAS || styleName === ENSALVERSTYLE ? (
              <MenuListDropdownPeople />
            ) : (
              <MenuListDropdown />
            )}
          </div>
        </Hidden>
      </Toolbar>
    </div>
  );
}
