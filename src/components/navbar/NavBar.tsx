import React from 'react';
import {
  Hidden
} from '@mui/material';

import CanscandingMenu from '../canscanding/CanscandingMenu';
import MenuItemListTest from '../fcComponets/DropdownTest';

const NavBar: React.FC = () => {

  return (
    <Hidden smDown>
      <CanscandingMenu />
      {/* <MenuItemListTest/> */}
    </Hidden>

  );
};

export default NavBar;