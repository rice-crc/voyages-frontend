import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Hidden,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon } from '@mui/icons-material';
import TableRangeSlider from './TableRangeSlider';
import TableCharacter from './TableCharacter';
const bgNavBar = "#85d4cbde"

const NavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tableType, setTableType] = useState<string>('integer');
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTableSelect = (tableType: string) => {
    setTableType(tableType)
    handleMenuClose();
  };

  const navbarItems = [
    { label: 'Select', icon: <HomeIcon />, onClick: handleMenuClose },
    { label: 'Ship and Nation', icon: <HomeIcon />, onClick: handleMenuClose },
    { label: 'Itinerary', icon: <HomeIcon />, onClick: handleMenuClose },
    { label: 'Enslavers', icon: <HomeIcon />, onClick: handleMenuClose },
    { label: 'Enslaved', icon: <HomeIcon />, onClick: handleMenuClose },
    { label: 'Date', icon: <HomeIcon />, onClick: handleMenuClose },
    { label: 'Outcomes', icon: <HomeIcon />, onClick: handleMenuClose },
    { label: 'Sources', icon: <HomeIcon />, onClick: handleMenuClose }
  ];

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: bgNavBar, color: 'black', fontSize: 12 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <HomeIcon />
          </Typography>
          <Hidden smDown>
            {navbarItems.map((item) => (
              <IconButton
                key={item.label}
                color="inherit"
                onClick={item.onClick}
                component="div" sx={{ flexGrow: 1 }}
                style={{ fontSize: 18 }}
              >
                {item.label}
              </IconButton>
            ))}
          </Hidden>
        </Toolbar>
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
          {navbarItems.map((item) => (
            <MenuItem key={item.label} onClick={item.onClick}>
              {item.icon}
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </AppBar>
      {tableType === 'integer' ? <TableRangeSlider /> : <TableCharacter />}
    </div>
  );
};

export default NavBar;