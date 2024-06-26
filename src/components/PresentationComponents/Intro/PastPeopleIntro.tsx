import { Grid } from '@mui/material';
import PersonImage from '@/assets/peoplepage.png';
import PEOPLE from '@/utils/flatfiles/people/people_page_data.json';
import '@/style/page-past.scss';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCurrentEnslavedPage } from '@/redux/getScrollEnslavedPageSlice';
import { setCurrentEnslaversPage } from '@/redux/getScrollEnslaversPageSlice';
import { resetAll } from '@/redux/resetAllSlice';
import { LabelFilterMeneList } from '@/share/InterfaceTypes';
import { checkPathPeople } from '@/utils/functions/checkPathPeople';

type LanguageKeys = 'en' | 'es' | 'pt';

const PastPeopleIntro = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const dispatch: AppDispatch = useDispatch();
  const isLanguageKey = (key: any): key is LanguageKeys => {
    return ['en', 'es', 'pt'].includes(key);
  };
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  if (!isLanguageKey(languageValue)) {
    throw new Error(`Invalid language value: ${languageValue}`);
  }
  return (
    <Grid container id="main-page-past-home">
      <Grid item sm={6} md={4} lg={4} className="grid-people-image">
        <Link to="https://www.loc.gov/pictures/item/2017659626/" target="_blank" rel="noopener noreferrer">
          <img
            className="flipped-image"
            src={PersonImage}
            alt="PersonImage"
          />
        </Link>
        {/* <img
          className="flipped-image"
          src={PersonImage}
          alt="PersonImage"
        /> */}

      </Grid>
      <Grid item sm={6} md={8} lg={8} className="grid-people-introduction">
        {PEOPLE.map((item, index) => {
          const { text_description, text_introuduce, header, credit } = item
          const textDescription = (text_description as LabelFilterMeneList)[languageValue];
          const textIntrouduce = (text_introuduce as LabelFilterMeneList)[languageValue];
          const creDitLable = (credit.label as LabelFilterMeneList)[languageValue];
          return (
            <div key={`${textIntrouduce}-${index}`} className='text-intro-box'>
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
        <Link
          to={PEOPLE[0].credit.hyperlink}
          style={{ textDecoration: 'none', color: '#000', fontSize: '0.95rem' }}
          className="credit-bottom-right"
        >
          {`${PEOPLE[0].credit.label[languageValue as LanguageKeys]}: ${PEOPLE[0].credit.artist_name}`}
          {/* ${currentYear} */}
        </Link>
      </Grid>
    </Grid>
  );
};

export default PastPeopleIntro;
