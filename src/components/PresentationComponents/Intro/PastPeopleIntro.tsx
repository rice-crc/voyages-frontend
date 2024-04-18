import { Box, Grid } from '@mui/material';
import PersonImage from '@/assets/personImg.png';
import PEOPLE from '@/utils/flatfiles/people_page_data.json';
import '@/style/page-past.scss';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import { resetAll } from '@/redux/resetAllSlice';
import { LabelFilterMeneList } from '@/share/InterfaceTypes';
import { checkPathPeople } from '@/utils/functions/checkPathPeople';

const PastPeopleIntro = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const dispatch: AppDispatch = useDispatch();
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);

  return (
    <>
      <div className="page" id="main-page-past-home">
        <Box
          sx={{
            flexGrow: 1,
            marginTop: {
              sm: '2rem',
            },
            textAlign: {
              xs: 'center',
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} className="grid-people-image">
              <img
                className="flipped-image"
                src={PersonImage}
                alt="PersonImage"
              />
            </Grid>
            <Grid item xs={12} sm={8} className="grid-people-introduction">
              {PEOPLE.map((item, index) => {
                const { text_description, text_introuduce, header } = item
                const textDescription = (text_description as LabelFilterMeneList)[languageValue];
                const textIntrouduce = (text_introuduce as LabelFilterMeneList)[languageValue];
                return (
                  <div key={`${textIntrouduce}-${index}`}>
                    <div className='text-intro'>
                      {textIntrouduce}
                      <div style={{ marginTop: 15 }}>{textDescription}</div>
                    </div>
                    <div className="btn-Enslaved-enslavers">
                      {header.map((title) => {
                        const textHeader = (title.label as LabelFilterMeneList)[languageValue];
                        const URL = checkPathPeople(textHeader)
                        return (
                          <Link
                            to={URL}
                            key={textHeader}
                            style={{ textDecoration: 'none' }}
                            onClick={() => {
                              dispatch(setCurrentEnslavedPage(1));
                              dispatch(setCurrentEnslaversPage(1));
                              dispatch(resetAll());
                              const keysToRemove = Object.keys(localStorage);
                              keysToRemove.forEach((key) => {
                                localStorage.removeItem(key);
                              });
                            }}
                          >
                            <div className="enslaved-btn">{textHeader}</div>
                          </Link>)
                      })}
                    </div>
                  </div>)
              })}
            </Grid>
          </Grid>
        </Box>
        <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
      </div>
    </>
  );
};

export default PastPeopleIntro;
