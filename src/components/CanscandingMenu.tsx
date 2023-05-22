import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Menu as MenuIcon } from '@mui/icons-material';
import { YoyagaesFilterMenu, filterMenu } from '../share/InterfaceTypes';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { AppBar, IconButton, Menu, Toolbar, Button,  ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, Hidden } from '@mui/material';
import { StyleMenuItem, bgNavBar } from '../styleMUI';
import TableRangeSlider from './TableRangeSlider';
import TableCharacter from './TableCharacter';

export default function CanscandingMenu() {
    const [open, setOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [tableType, setTableType] = useState<string>('integer');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [menuPosition, setMenuPosition] = useState<any>(null)
    const childrenMenu = [{}]
    const menuOptionFlat: YoyagaesFilterMenu = useSelector((state: RootState) => state.optionFlatMenu.value);
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

    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleShowSubMenu = (event: React.MouseEvent<HTMLButtonElement>,index:number) => {
        event?.preventDefault()
        setSelectedIndex(index)
        setOpen(!open);
        setMenuPosition({
            top: event.pageY+15,
            left:event.pageX-50,
        })
    };
   

    function handleListKeyDown(event: KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }
        prevOpen.current = open;
    }, [open]);



    const menuItemsResponsive = menuOptionFlat.map((item: filterMenu) => {
        return (
            <MenuItem key={item.label} onClick={handleMenuClose}>
                {item.label}
            </MenuItem>
        )
    })

    menuOptionFlat.forEach((item, index) => {
        if (item.children.length !== 0) {
            // const sortedChildren = item.children.sort();
            item.children.forEach((childernItem) => {
                childrenMenu.push({ subMenu: childernItem.label, id: index })
            })
        }
    })



    const menuListItems = menuOptionFlat.map((item: filterMenu, index:number) => {
        return (
            <Button
                key={`${item.label}-${index}`}
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                style={{color: '#000',textTransform: 'none' }}
                onClick={(event: React.MouseEvent<HTMLButtonElement>)=> handleShowSubMenu(event,index)}
            >
                {item.label}
            </Button>
        )
    })

 const subMenuItems = (
    <Menu
      anchorEl={anchorEl}
      open={!!menuPosition}
      onClose={() => {
        setMenuPosition(null)
        setOpen(false)
      }}
      anchorReference="anchorPosition"
      anchorPosition={{ top: menuPosition?.top ?? 0, left: menuPosition?.left ?? 0 }}
    >
      {childrenMenu.map((child: any, index: number) => {
        return (
          selectedIndex === child['id'] && (
            <StyleMenuItem>
            <MenuItem key={`${child.label}-${index}`}                
            selected={child['id'] === selectedIndex}
            // onClick={(event) => handleMenuItemClick(event, index)}
            >
              {child['subMenu']}
            </MenuItem>
            </StyleMenuItem>
          )
        );
      })}
    </Menu>
  );
  

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
                        {menuListItems}
                    </Hidden>
                </Toolbar>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            // {...TransitionProps}
                            // style={{
                            //     transformOrigin:
                            //         placement === 'bottom-start' ? 'left top' : 'left bottom',
                            // }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={()=> setMenuPosition(null)}>
                                    <MenuItem
                                        // autoFocusItem={open}
                                        id="composition-menu"
                                        aria-labelledby="composition-button"
                                        onKeyDown={handleListKeyDown}
                                    >
                                        {subMenuItems}
                                    </MenuItem>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
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
                    </MenuItem>{menuItemsResponsive}</Menu>
            </AppBar>
            {tableType === 'integer' ? <TableRangeSlider /> : <TableCharacter />}
        </div>
    );
}
