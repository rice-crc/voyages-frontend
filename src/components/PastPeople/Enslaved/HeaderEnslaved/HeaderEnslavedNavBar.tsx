import { MouseEventHandler, useState } from 'react';
import { AppBar, Box, IconButton, Hidden, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Button, Menu, Typography } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '@/style/Nav.scss';
import { setIsFilter } from '@/redux/getFilterSlice';
import {
  getColorNavbarEnslavedBackground,
  getColorBoxShadowEnslaved,
  getColorBTNBackgroundEnslaved,
  getColorBTNHoverEnslavedBackground,
} from '@/utils/functions/getColorStyle';

import {
  BaseFilter,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import { ALLENSLAVED, EnslavedTitle } from '@/share/CONST_DATA';
import CanscandingMenu from '@/components/canscanding/CanscandingMenu';

import { setPathName } from '@/redux/getDataSetCollectionSlice';
import CanscandingMenuEnslavedMobile from '@/components/canscanding/CanscandingMenuEnslavedMobile';
import ButtonDropdownSelectorEnslaved from '../ColumnSelectorEnslavedTable/ButtonDropdownSelectorEnslaved';
import { DrawerMenuPeopleBar } from '../../Header/DrawerMenuPeopleBar';
import {
  setBaseFilterPeopleEnslavedDataKey,
  setBaseFilterPeopleEnslavedDataSetValue,
  setBaseFilterPeopleEnslavedDataValue,
  setDataSetPeopleEnslavedHeader,
  setPeopleEnslavedBlocksMenuList,
  setPeopleEnslavedStyleName,
  setPeopleEnslavedTextIntro,
  setPeopleTableEnslavedFlatfile,
} from '@/redux/getPeopleEnslavedDataSetCollectionSlice';

const HeaderEnslavedNavBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );

  const { value, textHeader, styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  console.log('value', value);
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const handleSelectEnslavedDataset = (
    base_filter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[],
    filter_menu_flatfile: string,
    table_flatfile: string
  ) => {
    for (const base of base_filter) {
      dispatch(setBaseFilterPeopleEnslavedDataKey(base.var_name));
      dispatch(setPeopleEnslavedStyleName(styleName));
      dispatch(setBaseFilterPeopleEnslavedDataValue(base.value));
    }
    dispatch(setBaseFilterPeopleEnslavedDataSetValue(base_filter));
    dispatch(setDataSetPeopleEnslavedHeader(textHeder));
    dispatch(setPeopleEnslavedTextIntro(textIntro));
    dispatch(setPeopleEnslavedStyleName(styleName));
    dispatch(setPeopleEnslavedBlocksMenuList(blocks));
    setPeopleEnslavedFilterMenuFlatfile(filter_menu_flatfile);
    dispatch(setPeopleTableEnslavedFlatfile(table_flatfile));
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
        display: 'flex',
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: getColorNavbarEnslavedBackground(styleNamePeople),
          fontSize: 12,
          boxShadow: 'none',
          marginTop: '3rem',
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ mr: 2, display: { md: 'none' } }}
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
            <div className="enslaved-header" style={{ color: '#000000' }}>
              <Link
                to="/PastHomePage"
                style={{
                  textDecoration: 'none',
                  color: '#000000',
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
                borderWidth: '0.25px',
                borderClor: 'rgb(0 0 0 / 50%)',
              }}
            />
            <Typography
              component="div"
              variant="body1"
              fontWeight="500"
              sx={{
                cursor: 'pointer',
                alignItems: 'center',
                display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'flex',
                  paddingRight: 40,
                },
                margin: '10px 0',
                fontSize: 18,
                fontWeight: 600,
              }}
              onClick={() => {
                dispatch(setIsFilter(!isFilter));
                dispatch(setPathName(ALLENSLAVED));
              }}
            >
              {currentEnslavedPage !== 1 && (
                <>
                  <FilterAltIcon style={{ color: '#000000' }} />
                  <div className="menu-nav-bar"> Filter Search</div>
                </>
              )}
            </Typography>
          </Typography>
          <CanscandingMenuEnslavedMobile />
          <Box
            className="menu-nav-bar-select-box"
            sx={{
              display: {
                xs: 'none',
                sm: 'none',
                md: 'block',
                lg: 'block',
                textAlign: 'center',
                paddingRight: 40,
                fontWeight: 600,
                fontSize: 20,
              },
            }}
          >
            <Box className="menu-nav-bar-select" style={{ color: '#000000' }}>
              Select dataset
            </Box>
            {value.map((item: DataSetCollectionProps, index: number) => {
              const {
                base_filter,
                headers,
                style_name,
                blocks,
                table_flatfile,
                filter_menu_flatfile,
              } = item;
              return (
                <Button
                  key={`${item}-${index}`}
                  onClick={() =>
                    handleSelectEnslavedDataset(
                      base_filter,
                      headers.label,
                      headers.text_introduce,
                      style_name,
                      blocks,
                      filter_menu_flatfile,
                      table_flatfile
                    )
                  }
                  sx={{
                    color: '#ffffff',
                    fontWeight: 600,
                    height: 32,
                    fontSize: 12,
                    margin: '0 2px',
                    boxShadow: getColorBoxShadowEnslaved(style_name),
                    backgroundColor: getColorBTNBackgroundEnslaved(style_name),
                    '&:hover': {
                      backgroundColor:
                        getColorBTNHoverEnslavedBackground(style_name),
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
          {currentEnslavedPage !== 1 && isFilter && <CanscandingMenu />}
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
          <ButtonDropdownSelectorEnslaved />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
};

export default HeaderEnslavedNavBar;
function setPeopleEnslavedFilterMenuFlatfile(filter_menu_flatfile: string) {
  throw new Error('Function not implemented.');
}
