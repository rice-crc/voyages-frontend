import { useState } from 'react';
import { AppBar, Box, Hidden, Divider } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Menu, Typography } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { EnslaversTitle, PASTHOMEPAGE } from '@/share/CONST_DATA';
import CanscandingMenu from '@/components/SelectorComponents/Cascading/CanscandingMenu';
import { HeaderTitle } from '@/components/NavigationComponents/Header/HeaderTitle';
import '@/style/Nav.scss';
import { resetAllStateToInitailState } from '@/redux/resetAllSlice';
import GlobalSearchButton from '@/components/PresentationComponents/GlobalSearch/GlobalSearchButton';
import ButtonDropdownColumnSelector from '@/components/SelectorComponents/ButtonComponents/ButtonDropdownColumnSelector';
import CanscandingMenuMobile from '@/components/SelectorComponents/Cascading/CanscandingMenuMobile';

const HeaderEnslaversNavBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );

  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider
  );

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const handleMenuFilterMobileClose = () => {
    setAnchorFilterMobileEl(null);
  };
  const onClickResetOnHeader = () => {
    dispatch(resetAllStateToInitailState())
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
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
              onClickReset={onClickResetOnHeader}
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
              {inputSearchValue && currentEnslaversPage !== 1 && <GlobalSearchButton />}
            </Typography>
          </Typography>
          <CanscandingMenuMobile />
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
          {currentEnslaversPage !== 1 && <CanscandingMenu />}
        </Hidden>
      </AppBar>
      <Menu
        disableScrollLock={true}
        anchorEl={anchorFilterMobileEl}
        open={Boolean(anchorFilterMobileEl)}
        onClick={handleMenuFilterMobileClose}
      >
        <MenuListDropdownStyle>
          <ButtonDropdownColumnSelector />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
};

export default HeaderEnslaversNavBar;
