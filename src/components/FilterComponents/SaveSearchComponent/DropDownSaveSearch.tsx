
import '@/style/Nav.scss';
import { useEffect, useState } from "react";
import { usePageRouter } from "@/hooks/usePageRouter";
import { SaveSearchRequest } from "@/share/InterfaceTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCommonMakeSavedSearch } from '@/fetch/saveSearch/fetchCommonMakeSavedSearch';

const DropDownSaveSearch = () => {
    const dispatch: AppDispatch = useDispatch();
    const { endpointPath, endpointPathEstimate } = usePageRouter();
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const [saveSearchURL, setSaveSearchURL] = useState<string>('')
    const dataSend: SaveSearchRequest = {
        endpoint: (endpointPath !== undefined && endpointPath !== '') ? endpointPath : endpointPathEstimate || '',
        query: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : [],
    };
    console.log({ saveSearchURL })
    /*
{
  "endpoint": "voyage",
  "query": [
      {
            "varName": "voyage_dates__imp_arrival_at_port_of_dis_sparsedate__year",
            "searchTerm": [
                1640,
                1679
            ],
            "op": "btw"
        }

  ]
}

    */
    const handleSaveSearch = () => {
        fetchData()
    }
    const fetchData = async () => {
        try {
            const response = await dispatch(fetchCommonMakeSavedSearch(dataSend)).unwrap();
            if (response) {
                console.log({ response })
                const { id } = response
                setSaveSearchURL(id);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
    }, [endpointPath, endpointPathEstimate]);


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
                            retreive your particular set of search variables. You may also
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
                                    Current Searches<span> (1)</span>
                                </span>
                            </div>{' '}
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                >
                                    Clear
                                </button>{' '}
                                <button type="button" className="btn btn-info btn-sm" onClick={handleSaveSearch}>
                                    Save
                                </button>
                            </div>
                        </div>{' '}
                        <div className="v-description">
                            <div>Here are the queries saved during this session.</div>
                        </div>{' '}
                        <div className="flex-between v-saved-searches-header">
                            <div className="v-title">URL</div>
                        </div>{' '}
                        <div className="flex-between v-saved-searches-item">
                            <div id="SzPhOxXs">
                                {saveSearchURL}
                            </div>{' '}
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                >
                                    Load
                                </button>{' '}
                                <button type="button" className="btn btn-info btn-sm">
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropDownSaveSearch;
