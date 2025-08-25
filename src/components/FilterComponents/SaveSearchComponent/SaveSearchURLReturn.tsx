import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchCommonUseSavedSearch } from '@/fetch/saveSearch/fetchCommonUseSavedSearch';
import PageNotFound404 from '@/pages/PageNotFound404';
import { setFilterObject } from '@/redux/getFilterSlice';
import { setRouteSaveSearch } from '@/redux/getSaveSearchSlice';
import { AppDispatch } from '@/redux/store';

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
          fetchCommonUseSavedSearch(saveSearchID),
        ).unwrap();

        if (response) {
          const { query, front_end_path } = response;
          const normalizedPath = front_end_path.startsWith('/')
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
      <img src={LOADINGLOGO} alt="Loading..." />
    </div>
  ) : (
    <PageNotFound404 />
  );
};

export default UseSaveSearchURL;
