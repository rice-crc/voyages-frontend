import { usePageRouter } from '@/hooks/usePageRouter';
import { Filter, SaveSearchRequest } from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCommonMakeSavedSearch } from '@/fetch/saveSearch/fetchCommonMakeSavedSearch';
import { BASE_URL_FRONTEND } from '@/share/AUTH_BASEURL';
import { setListSaveSearchURL, setRouteSaveSearch, setSaveSearchUrlID } from '@/redux/getSaveSearchSlice';
import { useEffect } from 'react';
import { ASSESSMENT, ENSALVEDPAGE, ENSALVEDROUTE, ENSALVEDTYPE, ENSALVERSPAGE, ENSALVERSROUTE, ESTIMATES, VOYAGE, VOYAGEPATHENPOINT, allEnslavers } from '@/share/CONST_DATA';

const DropDownSaveSearch = () => {
    const dispatch: AppDispatch = useDispatch();
    const { endpointPath, styleName, endpointPeopleDirect } = usePageRouter();
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { saveSearchUrlID, listSaveSearchURL, routeSaveSearch } = useSelector((state: RootState) => state.getSaveSearch);

    let saveSearhURL: string = ''
    let endpointSaveSearch: string = ''
    if (endpointPeopleDirect === ENSALVEDROUTE) {
        endpointSaveSearch = endpointPeopleDirect
        saveSearhURL = ENSALVEDTYPE
    } else if (endpointPeopleDirect === ENSALVERSROUTE) {
        endpointSaveSearch = endpointPeopleDirect
        saveSearhURL = allEnslavers
    } else if (endpointPath === VOYAGEPATHENPOINT) {
        endpointSaveSearch = endpointPath
        saveSearhURL = VOYAGE
    } else if (endpointPath === ASSESSMENT) {
        endpointSaveSearch = endpointPath
        saveSearhURL = ESTIMATES
    }

    useEffect(() => {
        if (endpointPeopleDirect === ENSALVEDROUTE) {
            dispatch(setRouteSaveSearch(`${endpointPeopleDirect}/${styleName}`))
        } else if (endpointPeopleDirect === ENSALVERSROUTE) {
            dispatch(setRouteSaveSearch(`${endpointPeopleDirect}/${styleName}`))
        } else if (endpointPath === VOYAGEPATHENPOINT) {
            dispatch(setRouteSaveSearch(`${endpointPath}/${styleName}`))
        } else if (endpointPath === ASSESSMENT) {
            dispatch(setRouteSaveSearch(`${endpointPath}/${ESTIMATES}/`))
        }
    }, [routeSaveSearch])

    let filters: Filter[] = []
    if (Array.isArray(filtersObj[0]?.searchTerm) && filtersObj[0]?.searchTerm.length > 0 || !Array.isArray(filtersObj[0]?.op) && filtersObj[0]?.op === 'exact') {
        filters = filtersObj;
    } else {
        filters = filtersObj;
    }
    const dataSend: SaveSearchRequest = {
        endpoint: endpointSaveSearch,
        front_end_path: routeSaveSearch,
        query: filters,
    };


    const URLSAVESEARCH = `${BASE_URL_FRONTEND}/${saveSearhURL}/${saveSearchUrlID}`
    const handleSaveSearch = () => {
        fetchData();
    };

    const handleCopySaveSearch = () => {
        if (saveSearchUrlID) {
            navigator.clipboard.writeText(`${URLSAVESEARCH}`)
            alert(`Your URL ${URLSAVESEARCH} is copied`);
        }
    };

    const handleLoadSaveSearch = () => {
        if (styleName) {
            window.location.href = `${BASE_URL_FRONTEND}/${endpointSaveSearch}/${styleName}`;
        }
    };

    const handleClearSaveSearch = () => {
        dispatch(setSaveSearchUrlID(''));
        dispatch(setListSaveSearchURL([]));
        localStorage.removeItem('saveSearchID');
    };

    const fetchData = async () => {
        try {
            const response = await dispatch(
                fetchCommonMakeSavedSearch(dataSend)
            ).unwrap();
            if (response) {
                const { id } = response;
                dispatch(setSaveSearchUrlID(id));
                dispatch(setListSaveSearchURL([...listSaveSearchURL, id]));
                localStorage.setItem('saveSearchID', id);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    return (
        <div
            id="current-searches"
            className="dropdown-menu search-menu search-submenu search-menu-singular dropdown-menu-right show"
            control-disabled="true"
        >
            <div className="popover-content">
                <div>
                    <div className="v-panel-header">
                        <div className="v-panel-title-container">
                            <div className="v-panel-title">Current searches</div>{' '}
                        </div>
                        <div className="v-panel-description">
                            You can save a search by creating a link that can be later used to
                            retrieve your particular set of search variables. You may also
                            share your search by sharing the link to this search with other
                            people.
                        </div>
                    </div>
                </div>{' '}
                <div>
                    <div className="v-form-group">
                        <div className="flex-between">
                            <div className="v-title">
                                <span>
                                    Current Searches<span> ({listSaveSearchURL?.length})</span>
                                </span>
                            </div>{' '}
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={handleClearSaveSearch}
                                >
                                    Clear
                                </button>{' '}
                                <button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={handleSaveSearch}
                                >
                                    Save
                                </button>
                            </div>
                        </div>{' '}
                        <div className="v-description">
                            <div>Here are the queries saved during this session.</div>
                        </div>{' '}
                        {saveSearchUrlID && (
                            <>
                                <div className="flex-between v-saved-searches-header">
                                    <div className="v-title">URL</div>
                                </div>{' '}
                                <div className="flex-between v-saved-searches-item">
                                    <div id="SzPhOxXs" className='url-searches-item'>
                                        {saveSearchUrlID &&
                                            `${URLSAVESEARCH}`}
                                    </div>{' '}
                                    <div>
                                        <button
                                            onClick={handleLoadSaveSearch}
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            Load
                                        </button>{' '}
                                        <button
                                            type="button"
                                            className="btn btn-info btn-sm"
                                            onClick={handleCopySaveSearch}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropDownSaveSearch;
