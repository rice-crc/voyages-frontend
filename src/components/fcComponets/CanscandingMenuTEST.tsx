import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,Hidden
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import RangeSlider from '../RangeSlider';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { YoyagaesFilterMenu } from '../../share/InterfaceTypes';
import { bgNavBar } from '../../styleMUI';
import DropdownList from './DropdownTEST';
import TableRangeSlider from '../TableRangeSlider';
import TableCharacter from '../TableCharacter';
import MenuListsDropdownTEST from './MenuListsDropdownTEST';

const CanscandingMenuTEST: React.FC = () => {
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
                <MenuListsDropdownTEST/>
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
                <MenuListsDropdownTEST/>
                </Menu>
        </AppBar>
        {/* {tableType === 'integer' ? <TableRangeSlider /> : <TableCharacter />} */}
    </div>
    );
};


export default CanscandingMenuTEST;
