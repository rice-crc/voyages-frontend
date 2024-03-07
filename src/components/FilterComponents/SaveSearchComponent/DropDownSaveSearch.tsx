import * as React from 'react';
import { useEffect, useState } from 'react';
import { usePageRouter } from '@/hooks/usePageRouter';
import { SaveSearchRequest } from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCommonMakeSavedSearch } from '@/fetch/saveSearch/fetchCommonMakeSavedSearch';
import { BASE_URL_FRONTEND } from '@/share/AUTH_BASEURL';
import { setListSaveSearchURL, setSaveSearchUrlID } from '@/redux/getSaveSearchSlice';

const DropDownSaveSearch = () => {
    const dispatch: AppDispatch = useDispatch();
    const { endpointPath, styleName, endpointPeopleDirect } = usePageRouter();

    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { saveSearchUrlID, listSaveSearchURL } = useSelector((state: RootState) => state.getSaveSearch);
    let endpointSaveSearch: string = ''
    if (endpointPeopleDirect === 'past/enslaved' || endpointPeopleDirect === 'past/enslaver') {
        endpointSaveSearch = endpointPeopleDirect
    } else if (endpointPath === 'voyage' || endpointPath === 'assessment') {
        endpointSaveSearch = endpointPath
    }
    console.log({ endpointSaveSearch })
    const dataSend: SaveSearchRequest = {
        endpoint: endpointSaveSearch,
        query: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : [],
    };
    console.log({ saveSearchUrlID })

    const handleSaveSearch = () => {
        fetchData();
    };

    const handleCopySaveSearch = () => {
        if (saveSearchUrlID) {
            navigator.clipboard.writeText(`${BASE_URL_FRONTEND}/${endpointSaveSearch}/${styleName}#${saveSearchUrlID}`);
            alert(`Your URL ${BASE_URL_FRONTEND}/${endpointSaveSearch}/${styleName}#${saveSearchUrlID} is copied`);
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

    useEffect(() => { }, [endpointPath, endpointPeopleDirect, styleName]);

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
                                    <div id="SzPhOxXs">
                                        {saveSearchUrlID &&
                                            `${BASE_URL_FRONTEND}/${endpointSaveSearch}/${styleName}#${saveSearchUrlID} `}
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
