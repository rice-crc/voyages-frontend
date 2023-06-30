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
import { MenuListDropdownStyle } from "@/styleMUI";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import FilterICON from "@/assets/filterICON.svg";
import { AppDispatch, RootState } from "@/redux/store";
import { HeaderNavBarMenuProps } from "@/share/InterfaceTypes";
import CanscandingMenu from "../canscanding/CanscandingMenu";
import { useDispatch, useSelector } from "react-redux";
import { CurrentPageInitialState } from "@/share/InterfaceTypes";
import "@/style/Nav.scss";

import CanscandingMenuMobile from "../canscanding/CanscandingMenuMobile";

import { setIsFilter } from "@/redux/getFilterSlice";
import { ColumnSelector } from "../fcComponets/ColumnSelectorTable/ColumnSelector";
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
import { DrawerMenuBar } from "./drawerMenuBar";
import { BaseFilter } from "@/share/InterfactTypesDatasetCollection";

export default function HeaderNavBarMenu(props: HeaderNavBarMenuProps) {
  const dispatch: AppDispatch = useDispatch();
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { value, textHeader, styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const handleSelectDataset = (
    base_filter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[]
  ) => {
    for (const base of base_filter) {
      dispatch(setBaseFilterDataKey(base.var_name));
      dispatch(setBaseFilterDataValue(base.value));
    }
    dispatch(setBaseFilterDataSetValue(base_filter));
    dispatch(setDataSetHeader(textHeder));
    dispatch(setTextIntro(textIntro));
    dispatch(setStyleName(styleName));
    dispatch(setBlocksMenuList(blocks));
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

  // const drawer = value.map((item: any, index: number) => {
  //   const { base_filter, headers, style_name, blocks } = item;
  //   return (
  //     <MenuList
  //       dense
  //       style={{ padding: 0 }}
  //       key={`${item.headers.label}-${index}`}
  //     >
  //       <MenuItem>
  //         <ListItemText
  //           className="menu-nposition: relative;
  //           right: 5.5%;av-bar"
  //           onClick={() =>
  //             handleSelectDataset(
  //               base_filter,
  //               headers.label,
  //               headers.text_introduce,
  //               style_name,
  //               blocks
  //             )
  //           }
  //           primary={item.headers.label}
  //         />
  //       </MenuItem>
  //     </MenuList>
  //   );
  // });

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: getColorNavbarBackground(styleName),
          fontSize: 12,
          boxShadow: "none",
          marginTop: "3rem",
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
              width: { xs: 200, sm: 220 },
              fontWeight: { sm: 600, md: 500 },
            }}
          >
            <div
              className="voyages-header"
              style={{ color: getTextColor(styleName) }}
            >
              Voyages Database<span className="voyages-title">:</span>
              <div className="voyages-header-subtitle">{textHeader}</div>
            </div>
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
          <CanscandingMenuMobile />
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
            <Box
              className="menu-nav-bar-select"
              style={{ color: getTextColor(styleName) }}
            >
              Select dataset
            </Box>
            {value.map((item, index) => {
              const { base_filter, headers, style_name, blocks } = item;
              return (
                <Button
                  key={`${item}-${index}`}
                  onClick={() =>
                    handleSelectDataset(
                      base_filter,
                      headers.label,
                      headers.text_introduce,
                      style_name,
                      blocks
                    )
                  }
                  sx={{
                    color: "#ffffff",
                    fontWeight: 600,
                    height: 32,
                    fontSize: 12,
                    margin: "0 2px",
                    boxShadow: getColorBoxShadow(style_name),
                    backgroundColor: getColorBackground(style_name),
                    "&:hover": {
                      backgroundColor: getColorHoverBackground(style_name),
                    },
                  }}
                >
                  <div>{headers.label}</div>
                </Button>
              );
            })}
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
          >
            <DrawerMenuBar
              value={value}
              handleSelectDataset={handleSelectDataset}
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
