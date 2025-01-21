import { fetchCommonUseSavedSearch } from '@/fetch/saveSearch/fetchCommonUseSavedSearch';
import { setFilterObject } from '@/redux/getFilterSlice';
import { AppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { setRouteSaveSearch } from '@/redux/getSaveSearchSlice';

const UseSaveSearchURL = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname.split('/');
  const saveSearchID = pathName.slice(-1).join('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataUseSaveSearch = async () => {
      try {
        const response = await dispatch(
          fetchCommonUseSavedSearch(saveSearchID)
        ).unwrap();

        if (response) {
          const { query, front_end_path } = response;
          const normalizedPath =
            front_end_path.startsWith('/')
              ? front_end_path
              : `/${front_end_path}`;
          dispatch(setFilterObject(query));
          dispatch(setRouteSaveSearch(normalizedPath));
          navigate(normalizedPath, { replace: true });
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    };
    if (saveSearchID) fetchDataUseSaveSearch();
  }, [dispatch, navigate, saveSearchID]);

  return isLoading ? (
    <div className="loading-logo">
      <img src={LOADINGLOGO} />
    </div>
  ) : (
    <div>UseSaveSearchURL</div>
  );
};

export default UseSaveSearchURL;


// import { fetchCommonUseSavedSearch } from '@/fetch/saveSearch/fetchCommonUseSavedSearch';
// import { setFilterObject } from '@/redux/getFilterSlice';
// import { AppDispatch } from '@/redux/store';
// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
// import { setRouteSaveSearch } from '@/redux/getSaveSearchSlice';
// import NoDataState from '@/components/NoResultComponents/NoDataState';

// const UseSaveSearchURL = ({ saveSearchID }: { saveSearchID: string }) => {
//   console.log({ saveSearchID })
//   const dispatch: AppDispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLoading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDataUseSaveSearch = async () => {
//       try {
//         const response = await dispatch(
//           fetchCommonUseSavedSearch(saveSearchID)
//         ).unwrap();

//         if (response) {
//           const { query, front_end_path } = response;
//           const normalizedPath =
//             front_end_path.startsWith('/')
//               ? front_end_path
//               : `/${front_end_path}`;

//           dispatch(setFilterObject(query));
//           dispatch(setRouteSaveSearch(normalizedPath));
//           navigate(normalizedPath, { replace: true });
//         }
//       } catch (error) {
//         console.error('Error fetching saved search:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (saveSearchID) fetchDataUseSaveSearch();
//   }, [dispatch, navigate, saveSearchID]);

//   return isLoading ? (
//     <div className="loading-logo">
//       <img src={LOADINGLOGO} alt="Loading" />
//     </div>
//   ) : (
//     <NoDataState text='' />
//   );
// };

// export default UseSaveSearchURL;
