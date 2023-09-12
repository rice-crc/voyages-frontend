import { AppBar, Box, CssBaseline, Typography, Toolbar } from '@mui/material';
import { WHITE } from '@/styleMUI';
import LOGOVoyages from '@/assets/sv-logo_v2.svg';
import SearchVoyages from '@/assets/searchICON.svg';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { resetAll } from '@/redux/resetAllSlice';

export default function HeaderLogoSearch() {
  const dispatch: AppDispatch = useDispatch();
  const onChangePath = () => {
    dispatch(resetAll());
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };
  return (
    <Box>
      <CssBaseline />
      <AppBar
        component="nav"
        style={{
          backgroundColor: WHITE,
          zIndex: 100,
          boxShadow: 'none',
          height: 50,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography component="div" sx={{ cursor: 'pointer' }}>
            <Link
              to={'/'}
              style={{ textDecoration: 'none' }}
              onClick={onChangePath}
            >
              <img
                src={LOGOVoyages}
                alt="logo"
                style={{ position: 'relative', bottom: 5 }}
              />
            </Link>
          </Typography>

          <Typography component="div" sx={{ cursor: 'pointer' }}>
            <img src={SearchVoyages} alt="search" height={40} />
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
