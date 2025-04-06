import { Box, CssBaseline, Typography } from '@mui/material';
import LOGOVoyagesPeople from '@/assets/sv-logo_v2.svg';
import LOGOVoyages from '@/assets/sv-logo.png';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { resetAllStateToInitailState } from '@/redux/resetAllSlice';
import { setInputSearchValue } from '@/redux/getCommonGlobalSearchResultSlice';
import { resetBlockNameAndPageName } from '@/redux/resetBlockNameAndPageName';
import '@/style/Nav.scss';
import { usePageRouter } from '@/hooks/usePageRouter';

export default function HeaderLogo() {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = usePageRouter();
  const onChangePath = () => {
    dispatch(resetAllStateToInitailState());
    dispatch(resetBlockNameAndPageName());
    dispatch(setInputSearchValue(''));
    localStorage.clear();
  };
  
  return (
    <Box>
      <CssBaseline />
      <Typography component="div" sx={{ cursor: 'pointer' }}>
        <Link
          to={'/'}
          style={{ textDecoration: 'none' }}
          onClick={onChangePath} 
        >
          <img
            className="logo-voyage"
            src={styleName === 'PastHomePage' ? LOGOVoyagesPeople : LOGOVoyages}
            alt="voyage logo"
          />
        </Link>
      </Typography>
    </Box>
  );
}
