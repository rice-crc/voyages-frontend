import { useState } from 'react';
import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, IconButton, Menu, Toolbar,  MenuItem, Hidden } from '@mui/material';
import { MenuListDropdownStyle, bgNavBar } from '../../styleMUI';
import { MenuListDropdown } from './MenuListDropdown';

export default function CanscandingMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
                    <Hidden smDown>
                    <MenuListDropdown/>
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
                    <MenuListDropdownStyle>
                    <MenuListDropdown/>
                    </MenuListDropdownStyle>
                    </Menu>
            </AppBar>
        </div>
    );
}
