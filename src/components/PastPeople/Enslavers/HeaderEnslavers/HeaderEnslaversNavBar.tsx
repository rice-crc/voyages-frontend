import { useState } from 'react';
import { AppBar, Box, Hidden, Divider } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Menu, Typography } from '@mui/material';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { ALLENSLAVERS, EnslaversTitle, PASTHOMEPAGE } from '@/share/CONST_DATA';
import CanscandingMenu from '@/components/canscanding/CanscandingMenu';
import { HeaderTitle } from '@/components/FunctionComponents/HeaderTitle';
import { FilterButton } from '@/components/FunctionComponents/FilterButton';
import ButtonDropdownSelectorEnslavers from '../ColumnSelectorEnslaversTable/ButtonDropdownSelectorEnslavers';
import CanscandingMenuEnslaversMobile from '@/components/canscanding/CanscandingMenuEnslaversMobile';
import '@/style/Nav.scss';

const HeaderEnslavedNavBar: React.FC = () => {
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );

  const { isFilter } = useSelector((state: RootState) => state.getFilter);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const handleMenuFilterMobileClose = () => {
    setAnchorFilterMobileEl(null);
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
          <Typography
            component="div"
            sx={{
              flexGrow: 1,
              width: { xs: 200, sm: 220 },
              fontWeight: { sm: 600, md: 500 },
            }}
          >
            <HeaderTitle
              textHeader={''}
              HeaderTitle={EnslaversTitle}
              pathLink={PASTHOMEPAGE}
            />
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
            >
              <FilterButton
                pathName={ALLENSLAVERS}
                currentPage={currentEnslaversPage}
              />
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
      </AppBar>
      <Menu
        disableScrollLock={true}
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
