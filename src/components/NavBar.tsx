import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TableRangeSlider from './TableRangeSlider'
import TableCharacter from './TableCharacter';

const NavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tableType, setTableType] = useState<string>('integer');

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTableSelect = (tableType: string) => {
    setTableType(tableType)
    handleMenuClose();
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dropdown Menu
          </Typography>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleTableSelect('integer')}>
          Integers
        </MenuItem>
        <MenuItem onClick={() => handleTableSelect('character')}>
          Characters
        </MenuItem>
      </Menu>
      {tableType === 'integer' ?     <TableRangeSlider /> :   <TableCharacter />}
    </div>
  )
}

export default NavBar;