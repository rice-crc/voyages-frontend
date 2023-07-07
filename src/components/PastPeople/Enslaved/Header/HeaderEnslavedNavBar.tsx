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
import { Link, useNavigate } from "react-router-dom";
import "@/style/Nav.scss";
import { setIsFilter } from "@/redux/getFilterSlice";
import {
  getColorHoverBackground,
  getColorNavbarBackground,
  getTextColor,
  getColorBoxShadow,
  getColorBackgroundEnslaved,
} from "@/utils/getColorStyle";

import { BaseFilter } from "@/share/InterfactTypesDatasetCollection";
import { EnslavedTitle } from "@/share/CONST_DATA";
import CanscandingMenuMobile from "@/components/canscanding/CanscandingMenuMobile";
import CanscandingMenu from "@/components/canscanding/CanscandingMenu";
import { DrawerMenuPeopleBar } from "../../Header/DrawerMenuPeopleBar";
import { ColumnSelector } from "@/components/FcComponents/ColumnSelectorTable/ColumnSelector";
import {
  setBaseFilterPeopleDataKey,
  setBaseFilterPeopleDataSetValue,
  setBaseFilterPeopleDataValue,
  setDataSetPeopleHeader,
  setPeopleBlocksMenuList,
  setPeopleStyleName,
  setPeopleTextIntro,
} from "@/redux/getPeopleDataSetCollectionSlice";

export default function HeaderEnslavedNavBar() {
  const dispatch: AppDispatch = useDispatch();
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { value, textHeader, styleName } = useSelector(
    (state: RootState) => state.getPeopleDataSetCollection
  );
  console.log("styleName-->", styleName);
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleSelectDataset = (
    base_filter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[]
  ) => {
    for (const base of base_filter) {
      dispatch(setBaseFilterPeopleDataKey(base.var_name));
      dispatch(setBaseFilterPeopleDataValue(base.value));
    }
    dispatch(setBaseFilterPeopleDataSetValue(base_filter));
    dispatch(setDataSetPeopleHeader(textHeder));
    dispatch(setPeopleTextIntro(textIntro));
    dispatch(setPeopleStyleName(styleName));
    dispatch(setPeopleBlocksMenuList(blocks));

    const url = `/past/enslaved${styleName}`;
    navigate(url);
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
              className="enslaved-header"
              style={{ color: getTextColor(styleName) }}
            >
              <Link
                to="/past/enslaved"
                style={{
                  textDecoration: "none",
                  color: getTextColor(styleName),
                }}
              >
                {EnslavedTitle}
              </Link>
              <span className="enslaved-title">:</span>
              <div className="enslaved-header-subtitle">{textHeader}</div>
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
                    backgroundColor: getColorBackgroundEnslaved(style_name),
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
            {/* <DrawerMenuPeopleBar
              value={value}
              handleSelectDataset={handleSelectDataset}
            /> */}
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
