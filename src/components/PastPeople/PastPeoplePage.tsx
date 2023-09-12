import { Box, Grid } from '@mui/material';
import HeaderLogoSearch from '../header/HeaderSearchLogo';
import NavBarPeople from './Header/NavBarPeople';
import PersonImage from '@/assets/personImg.png';
import PEOPLE from '@/utils/flatfiles/people_page_data.json';
import '@/style/page-past.scss';
import { Link } from 'react-router-dom';
import { setPathName } from '@/redux/getDataPathNameSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  ALLENSLAVED,
  ALLENSLAVERS,
  ENSALVEDPAGE,
  ENSALVERSPAGE,
  PASTHOMEPAGE,
} from '@/share/CONST_DATA';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import { resetAll } from '@/redux/resetAllSlice';

const PastPeoplePage = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <HeaderLogoSearch />
      <NavBarPeople />
      <div className="page" id="main-page-past-home">
        <Box
          sx={{
            flexGrow: 1,
            marginTop: {
              sm: '2rem',
              md: '8%',
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4} className="grid-people-image">
              <img
                className="flipped-image"
                src={PersonImage}
                alt="PersonImage"
              />
            </Grid>
            <Grid item xs={8} className="grid-people-introduction">
              {PEOPLE.map((item, index) => (
                <div key={index}>
                  <div>{item.text_introuduce}</div>
                  <div>{item.text_description}</div>
                </div>
              ))}
              <div className="btn-Enslaved-enslavers">
                <Link
                  to={`/${PASTHOMEPAGE}${ENSALVEDPAGE}`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => {
                    dispatch(setCurrentEnslavedPage(1));
                    dispatch(setPathName(ALLENSLAVED));
                    dispatch(resetAll());
                    const keysToRemove = Object.keys(localStorage);
                    keysToRemove.forEach((key) => {
                      localStorage.removeItem(key);
                    });
                  }}
                >
                  <div className="enslaved-btn">Enslaved</div>
                </Link>
                <Link
                  to={`/${PASTHOMEPAGE}${ENSALVERSPAGE}`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => {
                    dispatch(setCurrentEnslaversPage(1));
                    dispatch(setPathName(ALLENSLAVERS));
                    dispatch(resetAll());
                    const keysToRemove = Object.keys(localStorage);
                    keysToRemove.forEach((key) => {
                      localStorage.removeItem(key);
                    });
                  }}
                >
                  <div className="enslavers-btn">Enslavers</div>
                </Link>
              </div>
            </Grid>
          </Grid>
        </Box>

        <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
      </div>
    </>
  );
};

export default PastPeoplePage;
