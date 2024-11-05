import {usePageRouter} from '@/hooks/usePageRouter';
import {SaveSearchRequest} from '@/share/InterfaceTypes';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/redux/store';
import {fetchCommonMakeSavedSearch} from '@/fetch/saveSearch/fetchCommonMakeSavedSearch';
import {BASE_URL_FRONTEND} from '@/share/AUTH_BASEURL';
import {setListSaveSearchURL, setReloadTable, setRouteSaveSearch, setSaveSearchUrlID} from '@/redux/getSaveSearchSlice';
import {useEffect} from 'react';
import {ASSESSMENT, ENSALVEDROUTE, ENSALVEDTYPE, ENSALVERSROUTE, ESTIMATES, VOYAGE, VOYAGEPATHENPOINT, allEnslavers} from '@/share/CONST_DATA';
import {filtersDataSend} from '@/utils/functions/filtersDataSend';
import {translationLanguagesSaveSearch} from '@/utils/functions/translationLanguages';
import {resetAll} from '@/redux/resetAllSlice';


const DropDownSaveSearch = () => {
    const dispatch: AppDispatch = useDispatch();
    const {endpointPath, styleName, endpointPeopleDirect} = usePageRouter();
    const {filtersObj} = useSelector((state: RootState) => state.getFilter);

    const {saveSearchUrlID, listSaveSearchURL, routeSaveSearch} = useSelector((state: RootState) => state.getSaveSearch);

    let saveSearhURL: string = '';
    let endpointSaveSearch: string = '';
    if (endpointPeopleDirect === ENSALVEDROUTE) {
        endpointSaveSearch = endpointPeopleDirect;
        saveSearhURL = ENSALVEDTYPE;
    } else if (endpointPeopleDirect === ENSALVERSROUTE) {
        endpointSaveSearch = endpointPeopleDirect;
        saveSearhURL = allEnslavers;
    } else if (endpointPath === VOYAGEPATHENPOINT) {
        endpointSaveSearch = endpointPath;
        saveSearhURL = VOYAGE;
    } else if (endpointPath === ASSESSMENT) {
        endpointSaveSearch = endpointPath;
        saveSearhURL = ESTIMATES;
    }


    useEffect(() => {
        if (endpointPeopleDirect === ENSALVEDROUTE) {
            dispatch(setRouteSaveSearch(`${endpointPeopleDirect}/${styleName}`));
        } else if (endpointPeopleDirect === ENSALVERSROUTE) {
            dispatch(setRouteSaveSearch(`${endpointPeopleDirect}/${styleName}`));
        } else if (endpointPath === VOYAGEPATHENPOINT) {
            dispatch(setRouteSaveSearch(`${endpointPath}/${styleName}`));
        } else if (endpointPath === ASSESSMENT) {
            dispatch(setRouteSaveSearch(`${endpointPath}/${ESTIMATES}/`));
        }
    }, [routeSaveSearch]);

    const filters = filtersDataSend(filtersObj, styleName!);
    const newFilters = filters !== undefined && filters!.map(filter => {
        const {label, title, ...filteredFilter} = filter;
        return filteredFilter;
    });

    const dataSend: SaveSearchRequest = {
        endpoint: endpointSaveSearch,
        front_end_path: routeSaveSearch,
        query: newFilters || [],
    };
    const URLSAVESEARCH = `${BASE_URL_FRONTEND}/${saveSearhURL}/`;
    const handleSaveSearch = () => {
        fetchData();
    };

    const handleCopySaveSearch = (id: string) => {
        if (id) {
            navigator.clipboard.writeText(`${URLSAVESEARCH}${id}`);
            alert(`Your URL ${URLSAVESEARCH}${id} is copied`);
            dispatch(setReloadTable(false));
        }
    };

    const saveSearchToLocalStorage = (searchID: string) => {
        const saveID = {[searchID]: searchID};
        localStorage.setItem('saveSearchID', JSON.stringify(saveID));
    };

    const handleLoadSaveSearch = (id: string) => {

        if (styleName) {
            dispatch(setSaveSearchUrlID(id));
            // Trigger table reload
            dispatch(setReloadTable(true));
            setTimeout(() => {
                dispatch(setReloadTable(false));
            }, 200);

            saveSearchToLocalStorage(id);
        } else if (endpointSaveSearch === 'assessment') {
            window.location.href = `${BASE_URL_FRONTEND}/${endpointSaveSearch}/estimates`;

            // Reset state and ensure table is not reloaded
            dispatch(resetAll());
            dispatch(setReloadTable(false));
        }
    };

    const handleClearSaveSearch = () => {
        dispatch(setSaveSearchUrlID(''));
        dispatch(setListSaveSearchURL([]));
        dispatch(setReloadTable(false));
        localStorage.removeItem('saveSearchID');
    };

    const fetchData = async () => {
        try {
            const response = await dispatch(
                fetchCommonMakeSavedSearch(dataSend)
            ).unwrap();
            if (response) {
                const {id} = response;
                dispatch(setSaveSearchUrlID(id));
                const listSaveSearhID = listSaveSearchURL.filter(searchID => searchID !== id);
                // const storedValue = localStorage.getItem('saveSearchID');
                dispatch(setListSaveSearchURL([...listSaveSearhID, id]));
                const saveID = {
                    [id]: id
                };
                const saveSearchID = JSON.stringify(saveID);
                localStorage.setItem('saveSearchID', saveSearchID);
            }
        } catch (error) {
            console.log('error', error);
        }
    };
    const {languageValue} = useSelector((state: RootState) => state.getLanguages);
    const translatedSaveSearch = translationLanguagesSaveSearch(languageValue);


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
                            <div className="v-panel-title">{translatedSaveSearch.saveSearchTitle}</div>{' '}
                        </div>
                        <div className="v-panel-description">
                            {translatedSaveSearch.saveSearchDescription}
                        </div>
                    </div>
                </div>{' '}
                <div>
                    <div className="v-form-group">
                        <div className="flex-between">
                            <div className="v-title">
                                <span>
                                    {translatedSaveSearch.saveSearchTitle}<span> ({listSaveSearchURL?.length})</span>
                                </span>
                            </div>{' '}
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={handleClearSaveSearch}
                                >
                                    {translatedSaveSearch.clearBtn}
                                </button>{' '}
                                <button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={handleSaveSearch}
                                >
                                    {translatedSaveSearch.saveBtn}
                                </button>
                            </div>
                        </div>{' '}
                        <div className="v-description">
                            <div>{translatedSaveSearch.hereDetail}</div>
                        </div>{' '}
                        {saveSearchUrlID && (
                            <>
                                <div className="flex-between v-saved-searches-header">
                                    <div className="v-title">URL</div>
                                </div>{' '}
                                {listSaveSearchURL.map((id) => (
                                    <div className="flex-between v-saved-searches-item" key={id}>

                                        <div id="SzPhOxXs" className='url-searches-item'>
                                            {saveSearchUrlID &&
                                                `${URLSAVESEARCH}${id}`}
                                        </div>{' '}
                                        <div id="SzPhOxXs" className='url-searches-item'>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => handleLoadSaveSearch(id)}
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                {translatedSaveSearch.loadBtn}
                                            </button>{' '}
                                            <button
                                                type="button"
                                                className="btn btn-info btn-sm"
                                                onClick={() => handleCopySaveSearch(id)}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropDownSaveSearch;;

