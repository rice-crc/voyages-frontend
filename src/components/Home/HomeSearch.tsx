import voyageIcon from '@/assets/voyage-cycle.svg';
import peopleIcon from '@/assets/people-cycle.svg';
import documentIcon from '@/assets/documents.svg';
import resourceIcon from '@/assets/resources.svg';
import { Link } from 'react-router-dom';
import {
  ALLENSLAVED,
  ALLVOYAGES,
  BLOGPAGE,
  DOCUMENTPAGE,
  PASTHOMEPAGE,
  VOYAGESPAGE,
} from '@/share/CONST_DATA';
import { setPathName } from '@/redux/getDataSetCollectionSlice';
import { setCurrentPage } from '@/redux/getScrollPageSlice';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import '@/style/homepage.scss';

const HomeSearch = () => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="voyages-people-places">
      <div className="voyage-page-box">
        <div className="voyages-people-places-title">Voyages</div>
        <Link
          to={`/${VOYAGESPAGE}`}
          onClick={() => {
            dispatch(setCurrentPage(1));
            dispatch(setPathName(ALLVOYAGES));
          }}
        >
          <img src={voyageIcon} alt="voyages" />
        </Link>
        <div className="voyages-people-places-subtitle">Search by vessel</div>
      </div>
      <div className="people-page-box">
        <div className="voyages-people-places-title">People</div>
        <Link
          to={`/${PASTHOMEPAGE}`}
          onClick={() => dispatch(setPathName(ALLENSLAVED))}
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
  );
};
export default HomeSearch;
