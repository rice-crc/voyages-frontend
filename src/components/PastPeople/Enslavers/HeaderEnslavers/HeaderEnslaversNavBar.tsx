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
import {
  ALLENSLAVED,
  ALLENSLAVERS,
  EnslavedTitle,
  EnslaversTitle,
} from '@/share/CONST_DATA';
import CanscandingMenu from '@/components/canscanding/CanscandingMenu';

import { setPathName } from '@/redux/getDataSetCollectionSlice';
import { DrawerMenuPeopleBar } from '../../Header/DrawerMenuPeopleBar';

import ButtonDropdownSelectorEnslavers from '../ColumnSelectorEnslaversTable/ButtonDropdownSelectorEnslavers';
import CanscandingMenuEnslaversMobile from '@/components/canscanding/CanscandingMenuEnslaversMobile';

const HeaderEnslavedNavBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
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

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: '#3f967d',
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
            <div className="enslaved-header" style={{ color: '#ffffff' }}>
              <Link
                to="/PastHomePage"
                style={{
                  textDecoration: 'none',
                  color: '#ffffff',
                }}
              >
                {EnslaversTitle}
              </Link>
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
                dispatch(setPathName(ALLENSLAVERS));
              }}
            >
              {currentEnslaversPage !== 1 && (
                <>
                  <FilterAltIcon />
                  <div
                    className="menu-filter-search-enslavers"
                    style={{ color: 'ffffff' }}
                  >
                    Filter Search
                  </div>
                </>
              )}
            </Typography>
          </Typography>
          <CanscandingMenuEnslaversMobile />
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
          ></Box>
        </Toolbar>
        <Hidden mdDown>
          {currentEnslaversPage !== 1 && isFilter && <CanscandingMenu />}
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
          <ButtonDropdownSelectorEnslavers />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
};

export default HeaderEnslavedNavBar;
