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
          dispatch(setFilterObject(query));
          dispatch(setRouteSaveSearch(front_end_path));
          navigate(`/${front_end_path}`, { replace: true });
          setLoading(false);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchDataUseSaveSearch();
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
