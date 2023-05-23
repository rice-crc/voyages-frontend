import { useState } from 'react';
import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, IconButton, Menu, Toolbar, MenuItem, Hidden } from '@mui/material';
import { MenuListDropdownStyle, bgNavBar } from '../../styleMUI';
import { useSelector } from "react-redux";
import { MenuListDropdown } from '../canscanding/MenuListDropdown';
import TableRangeSlider from '../TableRangeSlider';
import TableCharacter from '../TableCharacter';
import { RootState } from "../../redux/store";
import './menustyle.css';
import { ChildrenFilter, YoyagaesFilterMenu, filterMenu } from '../../share/InterfaceTypes';

const MenuItemListTest = () => {
    const menuOptionFlat: YoyagaesFilterMenu = useSelector((state: RootState) => state.optionFlatMenu.value);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [tableType, setTableType] = useState<string>('integer');

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTableSelect = (tableType: string) => {
        setTableType(tableType);
        handleMenuClose();
    };

    const renderSubChildItems = (subChildItems: ChildrenFilter[] = []) => {
        if (subChildItems.length) {
            return subChildItems.map((subChildItem: ChildrenFilter) => (
                <li key={subChildItem.label}><div >{subChildItem.label}</div></li>
            ));
        }
        return null;
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
                        <nav>
                            <ul className="nav">
                                {menuOptionFlat.map((item: filterMenu, index: number) => (
                                    <li key={item.label} className='navBar'>
                                        <div>{item.label}</div>
                                        <ul>
                                            {item.children.map((childItem: ChildrenFilter) => (
                                                <li key={childItem.label} className='childItem'>
                                                    <div >{childItem.label}</div>
                                                    <ul>
                                                        {renderSubChildItems(childItem.children)}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </nav>
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
                        <MenuListDropdown />
                    </MenuListDropdownStyle>
                </Menu>
            </AppBar>
            {tableType === 'integer' ? <TableRangeSlider /> : <TableCharacter />}
        </div>
    );
};

export default MenuItemListTest;
