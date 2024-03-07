import voyageIcon from '@/assets/voyage-cycle.svg';
import peopleIcon from '@/assets/people-cycle.svg';
import documentIcon from '@/assets/documents.svg';
import resourceIcon from '@/assets/resources.svg';
import { Link } from 'react-router-dom';
import {
  ALLENSLAVED,
  ALLVOYAGES,
  ALLVOYAGESPAGE,
  BLOGPAGE,
  DOCUMENTPAGE,
  PASTHOMEPAGE,
  TRANSATLANTICPAGE,
  VOYAGESPAGE,
} from '@/share/CONST_DATA';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setPathNameEnslaved, setPathNameVoyages } from '@/redux/getDataPathNameSlice';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { resetAll } from '@/redux/resetAllSlice';

const GlobalHomeNavigations = () => {
  const dispatch: AppDispatch = useDispatch();

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
          <div className="voyages-people-places-title">Voyages</div>
          <Link
            to={`${TRANSATLANTICPAGE}#voyages`}
            onClick={handleHomeSearch}
          >
            <img src={voyageIcon} alt="Search by Vessels" style={{ opacity: 0.65 }} />
          </Link>
          <div className="voyages-people-places-subtitle">
            Search by vessels, places, and periods
          </div>
        </div>
        <div className="place-page-box">
          <div className="voyages-people-places-title">People</div>
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
          <div className="voyages-people-places-subtitle">Find a person</div>
        </div>
        <div className="place-page-box">
          <div className="voyages-people-places-title">Documents</div>
          <Link to={`/${DOCUMENTPAGE}`}>
            <img src={documentIcon} alt="Documents" width={129} />
          </Link>
          <div className="voyages-people-places-subtitle">
            Read primary sources
          </div>
        </div>
        <div className="place-page-box">
          <div className="voyages-people-places-title">Writing</div>
          <Link to={`/${BLOGPAGE}`}>
            <img src={resourceIcon} alt="Writing" width={129} />
          </Link>
          <div className="voyages-people-places-subtitle">
            Lesson plans, essays, and more
          </div>
        </div>
      </div>
    </>
  );
};
export default GlobalHomeNavigations;
