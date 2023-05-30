import { useState } from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Menu,
  Toolbar,
  MenuItem,
  Hidden,
} from "@mui/material";
import { MenuListDropdownStyle, bgNavBar } from "../../styleMUI";
import { MenuListDropdown } from "./MenuListDropdown";
import { CanscandingMenuProps } from "../../share/InterfaceTypeNav";

export default function CanscandingMenu(props: CanscandingMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tableType, setTableType] = useState<string>("integer");
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTableSelect = (tableType: string) => {
    setTableType(tableType);
    handleMenuClose();
  };

  return (
    <div>
      <AppBar
        position="static"
        style={{
          backgroundColor: "transparent",
          color: "black",
          fontSize: 16,
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Hidden smUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            <MenuListDropdown />
          </Hidden>
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleTableSelect("integer")}>
            Integers
          </MenuItem>
          <MenuItem onClick={() => handleTableSelect("character")}>
            Characters
          </MenuItem>
          <MenuListDropdownStyle>
            <MenuListDropdown />
          </MenuListDropdownStyle>
        </Menu>
      </AppBar>
    </div>
  );
}
