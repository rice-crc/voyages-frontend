import { fetchCommonUseSavedSearch } from '@/fetch/saveSearch/fetchCommonUseSavedSearch';
import { setFilterObject } from '@/redux/getFilterSlice';
import { setQuerySaveSeary } from '@/redux/getQuerySaveSearchSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ASSESSMENT, ESTIMATES } from '@/share/CONST_DATA';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';

const UseSaveSearchURL = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = location.pathname.split('/');
    const saveSearchID = pathName.slice(-1).join('');
    const { routeSaveSearch } = useSelector(
        (state: RootState) => state.getSaveSearch
    );
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const routeURL = localStorage.getItem('routeSaveSearch');
        if (routeURL) {
            const fetchDataUseSaveSearch = async () => {
                try {
                    const response = await dispatch(
                        fetchCommonUseSavedSearch(saveSearchID)
                    ).unwrap();

                    if (response) {
                        const { query } = response;
                        dispatch(setFilterObject(query));
                        navigate(`/${routeURL}`, { replace: true });
                        setLoading(false)
                    }
                } catch (error) {
                    console.log('error', error);
                }
            };
            fetchDataUseSaveSearch();
        }
    }, [dispatch, navigate, routeSaveSearch, saveSearchID]);

    return isLoading ? (
        <div className="loading-logo">
            <img src={LOADINGLOGO} />
        </div>
    ) : (<div>UseSaveSearchURL</div>)


};

export default UseSaveSearchURL;
