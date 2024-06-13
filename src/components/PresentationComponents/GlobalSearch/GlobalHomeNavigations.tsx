import voyageIcon from '@/assets/voyage-cycle.svg';
import peopleIcon from '@/assets/people-cycle.svg';
import timelapseIcon from '@/assets/timelapse.svg';
import resourceIcon from '@/assets/resources.svg';
import { Link } from 'react-router-dom';
import {
  ALLENSLAVED,
  ALLVOYAGES,
  BLOGPAGE,
  PASTHOMEPAGE,
  TRANSATLANTICPAGE,
  TRANSATLANTICTIMELAPSE,
} from '@/share/CONST_DATA';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setPathNameEnslaved, setPathNameVoyages } from '@/redux/getDataPathNameSlice';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { resetAll } from '@/redux/resetAllSlice';
import { translationHomepage } from '@/utils/functions/translationLanguages';

const GlobalHomeNavigations = () => {
  const dispatch: AppDispatch = useDispatch();
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  const translatedHomepage = translationHomepage(languageValue)

  const handleHomeSearch = () => {
    dispatch(setCurrentPage(1));
    dispatch(setPathNameVoyages(ALLVOYAGES));
    dispatch(resetAll());
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };
  return (
    <>
      <div className="voyages-people-places">
        <div className="place-page-box">
          <div className="voyages-people-places-title">{translatedHomepage.navigatorTitleVoyages}</div>
          <Link
            to={`${TRANSATLANTICPAGE}#voyages`}
            onClick={handleHomeSearch}
          >
            <img src={voyageIcon} alt="Search by Vessels" style={{ opacity: 0.65 }} />
          </Link>
          <div className="voyages-people-places-subtitle">
            {translatedHomepage.navigatorSubTitleVoyages}
          </div>
        </div>
        <div className="place-page-box">
          <div className="voyages-people-places-title">{translatedHomepage.navigatorTitlePeople}</div>
          <Link
            to={`/${PASTHOMEPAGE}`}
            onClick={() => {
              const keysToRemove = Object.keys(localStorage);
              keysToRemove.forEach((key) => {
                localStorage.removeItem(key);
              });
              dispatch(setPathNameEnslaved(ALLENSLAVED));
            }}
          >
            <img src={peopleIcon} alt="People" style={{ opacity: 0.65 }} />
          </Link>
          <div className="voyages-people-places-subtitle">{translatedHomepage.navigatorSubTitlePeople}</div>
        </div>
        <div className="place-page-box-timelapse">
          <div className="voyages-people-places-title">{translatedHomepage.navigatorTitleTimelapse}</div>
          <Link to={`${TRANSATLANTICTIMELAPSE}#timelapse`} >
            <img src={timelapseIcon} alt="Timelapse" />
          </Link>
          <div className="voyages-people-places-subtitle">
            <div>{translatedHomepage.navigatorSubTitleTimelapse}</div>
            <div>{translatedHomepage.navigatorSubTitleTimelapseNewLine}</div>
          </div>
        </div>
        <div className="place-page-box">
          <div className="voyages-people-places-title">{translatedHomepage.navigatorTitleWriting}</div>
          <Link to={`/${BLOGPAGE}`}>
            <img src={resourceIcon} alt="Writing" width={129} />
          </Link>
          <div className="voyages-people-places-subtitle">
            {translatedHomepage.navigatorSubTitleWriting}
          </div>
        </div>
      </div>
    </>
  );
};
export default GlobalHomeNavigations;
