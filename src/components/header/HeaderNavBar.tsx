import { MouseEventHandler, useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Hidden,
  MenuList,
  Divider,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { MenuListDropdownStyle, StyleDiver } from "@/styleMUI";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import FilterICON from "@/assets/filterICON.svg";
import { AppDispatch, RootState } from "@/redux/store";
import { HeaderNavBarMenuProps } from "@/share/InterfaceTypes";
import CanscandingMenu from "../canscanding/CanscandingMenu";
import { useDispatch, useSelector } from "react-redux";
import { CurrentPageInitialState } from "@/share/InterfaceTypes";
import "@/style/Nav.scss";

import CanscandingMenuMobile from "../canscanding/CanscandingMenuMobile";
import { ColumnMenuItems } from "../fcComponets/ColumnSelectorTable/ColumnMenuItems";
import { setIsFilter } from "@/redux/getFilterSlice";

const navItems = ["About", "Vessels", "Itinerary", "Collections"];

export default function HeaderNavBarMenu(props: HeaderNavBarMenuProps) {
  const dispatch: AppDispatch = useDispatch();
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const handleMenuFilterMobileOpen = (event: any) => {
    setAnchorFilterMobileEl(event.currentTarget);
  };

  const handleMenuFilterMobileClose = () => {
    setAnchorFilterMobileEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectMenu = (name: string) => {
    handleMenuClose();
  };

  const drawer = navItems.map((item, index) => (
    <MenuList dense style={{ padding: 0 }} key={`${item}-${index}`}>
      <MenuItem>
        <ListItemText
          className="menu-nposition: relative;
          right: 5.5%;av-bar"
          onClick={() => handleSelectMenu(item)}
          primary={item}
        />
      </MenuItem>
    </MenuList>
  ));

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: "#93D0CB",
          color: "black",
          fontSize: 12,
          boxShadow: "none",
          marginTop: "2.5rem",
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography
            component="div"
            sx={{
              flexGrow: 1,
              color: "#000000",
              fontSize: { xs: 20, sm: 32, md: 60 },
              width: { xs: 200, sm: 220 },
              fontWeight: { sm: 600, md: 500 },
            }}
          >
            <div
              onClick={() => {
                console.log("go to HOME");
              }}
              className="voyages-header"
            >
              Voyages Database
            </div>
            <Divider
              sx={{
                width: { xs: 300, sm: 400, md: 600, lg: 800, xl: 900 },
                borderWidth: "0.25px",
                borderClor: "rgb(0 0 0 / 50%)",
              }}
            />
            <Typography
              component="div"
              variant="body1"
              fontWeight="500"
              sx={{
                cursor: "pointer",
                alignItems: "center",
                display: {
                  xs: "none",
                  sm: "none",
                  md: "flex",
                  paddingRight: 40,
                },
                margin: "10px 0",
                fontSize: 18,
                fontWeight: 600,
              }}
              onClick={() => dispatch(setIsFilter(!isFilter))}
            >
              {currentPage !== 1 && (
                <>
                  <img src={FilterICON} alt="logo" />
                  <div className="menu-nav-bar"> Filter Search</div>
                </>
              )}
            </Typography>
          </Typography>
          <CanscandingMenuMobile />
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "block",
                paddingRight: 40,
              },
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "#000",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 20,
                }}
              >
                <div className="menu-nav-bar">{item}</div>
              </Button>
            ))}
          </Box>
        </Toolbar>
        <Hidden mdDown>
          {currentPage !== 1 && isFilter && <CanscandingMenu />}
        </Hidden>
        <Box component="nav">
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClick={handleMenuClose}
            onMouseMove={handleMenuClose}
          >
            {drawer}
          </Menu>
        </Box>
      </AppBar>
      <Menu
        anchorEl={anchorFilterMobileEl}
        open={Boolean(anchorFilterMobileEl)}
        onClick={handleMenuFilterMobileClose}
      >
        <MenuListDropdownStyle>
          <ColumnMenuItems />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
}
