import { fetchCommonUseSavedSearch } from '@/fetch/saveSearch/fetchCommonUseSavedSearch';
import { setFilterObject } from '@/redux/getFilterSlice';
import { setQuerySaveSeary } from '@/redux/getQuerySaveSearchSlice';
import { AppDispatch, } from '@/redux/store';
import { ASSESSMENT, ESTIMATES } from '@/share/CONST_DATA';
import { useEffect } from 'react';
import { useDispatch, } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';


const UseSaveSearchURL = () => {
    const dispatch: AppDispatch = useDispatch();

    const location = useLocation();
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('returnUrl');
    const id = params.get('id');
    console.log({ location, returnUrl })
    useEffect(() => {

        const fetchDataUseSaveSearch = async () => {
            try {
                const response = await dispatch(
                    fetchCommonUseSavedSearch(id!)
                ).unwrap();
                if (response) {
                    const { query } = response;
                    dispatch(setFilterObject(query));
                    if (returnUrl !== `${ASSESSMENT}/${ESTIMATES}/`) {
                        const filterObjectEstimate = {
                            filter: query
                        }
                        localStorage.setItem('filterObject', JSON.stringify(filterObjectEstimate))
                    }
                    dispatch(setQuerySaveSeary(query));
                }
            } catch (error) {
                console.log('error', error);
            }
        };

        if (id) {
            fetchDataUseSaveSearch()
            navigate(`/${returnUrl!}`, { replace: true });
        }
    }, [dispatch, returnUrl, id, navigate]);
    return null
};

export default UseSaveSearchURL;
