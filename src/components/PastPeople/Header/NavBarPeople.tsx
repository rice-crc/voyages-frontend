import { MouseEventHandler, useState } from "react";
import { AppBar, Box, IconButton, Hidden, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { MenuListDropdownStyle } from "@/styleMUI";
import { Button, Menu, Typography } from "@mui/material";
import FilterICON from "@/assets/filterICON.svg";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { CurrentPageInitialState } from "@/share/InterfaceTypes";
import PEOPLE from "@/utils/peopel_page_data.json";
import "@/style/Nav.scss";

import { setIsFilter } from "@/redux/getFilterSlice";

import {
  setBaseFilterDataKey,
  setBaseFilterDataSetValue,
  setBaseFilterDataValue,
  setBlocksMenuList,
  setDataSetHeader,
  setStyleName,
  setTextIntro,
} from "@/redux/getDataSetCollectionSlice";

import {
  getColorBackground,
  getColorHoverBackground,
  getColorNavbarBackground,
  getTextColor,
  getColorBoxShadow,
} from "@/utils/getColorStyle";

import { BaseFilter } from "@/share/InterfactTypesDatasetCollection";
import { ColumnSelector } from "@/components/FcComponents/ColumnSelectorTable/ColumnSelector";
import { DrawerMenuBar } from "@/components/header/drawerMenuBar";
import { POPELETILET } from "@/share/CONST_DATA";
import { useNavigate } from "react-router-dom";
import { DrawerMenuPeopleBar } from "./DrawerMenuPeopleBar";

export default function NavBarPeople() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const handleMenuFilterMobileClose = () => {
    setAnchorFilterMobileEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectMenuItems = (item: string) => {
    // Define the logic for navigating to the desired path based on the value of 'item'
    if (item === "About") {
      navigate("/past");
    } else if (item === "Enslaved") {
      navigate("/past/enslaved");
    } else if (item === "Enslavers") {
      navigate("/past/enslaver");
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: "#ffffff",
          fontSize: 12,
          boxShadow: "none",
          marginTop: "3rem",
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
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
              width: { xs: 200, sm: 220 },
              fontWeight: { sm: 600, md: 500 },
            }}
          >
            <div className="people-header">{POPELETILET}</div>
            <Divider
              sx={{
                width: { xs: 300, sm: 400, md: 470, lg: 800, xl: 900 },
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
          <Box
            className="menu-nav-bar-select-box"
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "block",
                lg: "block",
                textAlign: "center",
                paddingRight: 40,
                fontWeight: 600,
                fontSize: 20,
              },
            }}
          >
            {PEOPLE[0].header?.map((item, index) => {
              return (
                <Button
                  onClick={() => handleSelectMenuItems(item)}
                  key={`${item}-${index}`}
                  sx={{
                    color: "#000000",
                    fontWeight: 600,
                    fontSize: 20,
                    margin: "0 2px",
                    textTransform: "none",
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  <div>{item}</div>
                </Button>
              );
            })}
          </Box>
        </Toolbar>
        <Box component="nav">
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClick={handleMenuClose}
          >
            <DrawerMenuPeopleBar
              value={PEOPLE[0]?.header}
              handleSelectMenuItems={handleSelectMenuItems}
            />
          </Menu>
        </Box>
      </AppBar>
      <Menu
        anchorEl={anchorFilterMobileEl}
        open={Boolean(anchorFilterMobileEl)}
        onClick={handleMenuFilterMobileClose}
      >
        <MenuListDropdownStyle>
          <ColumnSelector />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
}
