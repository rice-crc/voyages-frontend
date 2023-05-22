import React from 'react';
import {
  Hidden
} from '@mui/material';

import MenuListComposition from './NestedMenuItems';

const NavBar: React.FC = () => {

  return (
    <Hidden smDown>
      <MenuListComposition />
    </Hidden>

  );
};

export default NavBar;