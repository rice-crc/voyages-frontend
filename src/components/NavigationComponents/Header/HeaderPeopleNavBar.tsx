import { MouseEventHandler, useState } from 'react';
import { AppBar, Box, IconButton, Hidden, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { Button, Menu } from '@mui/material';
import PEOPLE from '@/utils/flatfiles/people_page_data.json';
import { useNavigate } from 'react-router-dom';
import { HeaderDrawerMenuPeopleBar } from './HeaderDrawerMenuPeopleBar';
import '@/style/Nav.scss';
import {
  ALLENSLAVED,
  ALLENSLAVERS,
  ENSALVEDPAGE,
  ENSALVERSPAGE,
  Enslaved,
  POPELETILET,
  EnslaversTitle,
  ALLENSLAVEDPAGE,
  ENSALVERSTYLE,
  allEnslavers,
  INTRAAMERICANENSLAVERS,
  TRANSATLANTICENSLAVERS,
} from '@/share/CONST_DATA';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import { setPathEnslavers, setPathNameEnslaved } from '@/redux/getDataPathNameSlice';
import { resetAllStateToInitailState } from '@/redux/resetAllSlice';
import HeaderLogo from './HeaderLogo';

export default function HeaderPeopleNavBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch: AppDispatch = useDispatch();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectMenuItems = (item: string) => {
    dispatch(resetAllStateToInitailState())
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
    if (item === Enslaved) {
      navigate(`${ENSALVEDPAGE}${ALLENSLAVEDPAGE}#people`);
      dispatch(setCurrentEnslavedPage(1));
      dispatch(setPathNameEnslaved(ALLENSLAVED));
    } else if (item === EnslaversTitle) {
      navigate(`${ENSALVERSPAGE}/${allEnslavers}#people`);
      dispatch(setCurrentEnslaversPage(1));
      dispatch(setPathEnslavers(ALLENSLAVERS));
    } else {
      navigate('/');
    }
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
          backgroundColor: '#ffffff',
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
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
            <span className='header-logo-icon'>
              <HeaderLogo />
              <div className="people-header">{POPELETILET}</div>
            </span>

          </Typography>
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
            {PEOPLE[0].header?.map((item, index) => {
              return (
                <Button
                  onClick={() => handleSelectMenuItems(item)}
                  key={`${item}-${index}`}
                  sx={{
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: 20,
                    margin: '0 2px',
                    textTransform: 'none',
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
            disableScrollLock={true}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClick={handleMenuClose}
          >
            <HeaderDrawerMenuPeopleBar
              value={PEOPLE[0]?.header}
              handleSelectMenuItems={handleSelectMenuItems}
            />
          </Menu>
        </Box>
      </AppBar>
    </Box>
  );
}
