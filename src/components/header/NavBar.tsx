import React from 'react';
import {
  Hidden
} from '@mui/material';

import CanscandingMenu from '../canscanding/CanscandingMenu';
import MenuList from '../fcComponets/MenuListsDropdownTEST';
import CanscandingMenuTEST from '../fcComponets/CanscandingMenuTEST';

const NavBar: React.FC = () => {

  return (
    <Hidden smDown>
      {/* <CanscandingMenuTEST />
      <div style={{marginTop : 100}}></div> */}
      <CanscandingMenu />

    </Hidden>

  );
};

export default NavBar;