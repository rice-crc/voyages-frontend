import { usePageRouter } from '@/hooks/usePageRouter';
import { SaveSearchRequest } from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCommonMakeSavedSearch } from '@/fetch/saveSearch/fetchCommonMakeSavedSearch';
import { BASE_URL_FRONTEND } from '@/share/AUTH_BASEURL';
import { setListSaveSearchURL, setRouteSaveSearch, setSaveSearchUrlID } from '@/redux/getSaveSearchSlice';
import { useEffect } from 'react';
import { ASSESSMENT, ENSALVEDROUTE, ENSALVEDTYPE, ENSALVERSROUTE, ESTIMATES, VOYAGE, VOYAGEPATHENPOINT, allEnslavers } from '@/share/CONST_DATA';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { translationLanguagesSaveSearch } from '@/utils/functions/translationLanguages';
import { resetAll } from '@/redux/resetAllSlice';

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

    const filters = filtersDataSend(filtersObj, styleName!)
    const dataSend: SaveSearchRequest = {
        endpoint: endpointSaveSearch,
        front_end_path: routeSaveSearch,
        query: filters || [],
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
            dispatch(resetAll())
        } else if (endpointSaveSearch === 'assessment') {
            window.location.href = `${BASE_URL_FRONTEND}/${endpointSaveSearch}/estimates`;
            dispatch(resetAll())
        }
        const keysToRemove = Object.keys(localStorage);
        keysToRemove.forEach((key) => {
            localStorage.removeItem(key);
        });
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
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);
    const translatedSaveSearch = translationLanguagesSaveSearch(languageValue)


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
                                            {translatedSaveSearch.loadBtn}
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
