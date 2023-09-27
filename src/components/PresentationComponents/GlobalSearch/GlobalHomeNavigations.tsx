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
  VOYAGESPAGE,
} from '@/share/CONST_DATA';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setPathName } from '@/redux/getDataPathNameSlice';
import { setCurrentPage } from '@/redux/getScrollPageSlice';

const GlobalHomeNavigations = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleHomeSearch = () => {
    dispatch(setCurrentPage(1));
    dispatch(setPathName(ALLVOYAGES));
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };
  return (
    <>
      <div className="voyages-people-places">
        <div className="voyage-page-box">
          <div className="voyages-people-places-title">Voyages</div>
          <Link
            to={`${VOYAGESPAGE}${ALLVOYAGESPAGE}`}
            onClick={handleHomeSearch}
          >
            <img src={voyageIcon} alt="voyages" />
          </Link>
          <div className="voyages-people-places-subtitle">
            Search by Vessels, Places, and Periods
          </div>
        </div>
        <div className="people-page-box">
          <div className="voyages-people-places-title">People</div>
          <Link
            to={`/${PASTHOMEPAGE}`}
            onClick={() => {
              const keysToRemove = Object.keys(localStorage);
              keysToRemove.forEach((key) => {
                localStorage.removeItem(key);
              });
              dispatch(setPathName(ALLENSLAVED));
            }}
          >
            <img src={peopleIcon} alt="voyages" />
          </Link>
          <div className="voyages-people-places-subtitle">Find a person</div>
        </div>
        <div className="place-page-box">
          <div className="voyages-people-places-title">Documents</div>
          <Link to={`/${DOCUMENTPAGE}`}>
            <img src={documentIcon} alt="voyages" width={129} />
          </Link>
          <div className="voyages-people-places-subtitle">
            Read Primary Sources
          </div>
        </div>
        <div className="place-page-box">
          <div className="voyages-people-places-title">Writing</div>
          <Link to={`/${BLOGPAGE}`}>
            <img src={resourceIcon} alt="voyages" width={129} />
          </Link>
          <div className="voyages-people-places-subtitle">
            Lesson Plans, Essays, and More
          </div>
        </div>
      </div>
    </>
  );
};
export default GlobalHomeNavigations;
