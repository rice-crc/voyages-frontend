import EstimatesNavBar from "./EstimatesNavBar";
import EstimatesTabs from "./EstimatesTabs";
import { Grid } from '@mui/material';
import EstimateCollapse from "./EstimateCollapse";
import ShowAllSelected from "./ShowAllSelected";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchCommonUseSavedSearch } from "@/fetch/saveSearch/fetchCommonUseSavedSearch";
import { setQuerySaveSeary } from "@/redux/getQuerySaveSearchSlice";
import { setFilterObject } from "@/redux/getFilterSlice";
import { ASSESSMENT, ESTIMATES } from "@/share/CONST_DATA";

const Estimates = () => {
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('returnUrl');
    const IDSaveSearch = params.get('id');
    const [viewAll, setViewAll] = useState(false);

    const handleViewAll = () => {
        setViewAll(!viewAll);
    };

    useEffect(() => {

        const fetchDataUseSaveSearch = async () => {
            try {
                const response = await dispatch(
                    fetchCommonUseSavedSearch(IDSaveSearch!)
                ).unwrap();
                if (response) {
                    const { query } = response;
                    dispatch(setFilterObject(query));
                    if (returnUrl === `${ASSESSMENT}/${ESTIMATES}/`) {
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

        if (IDSaveSearch) {
            fetchDataUseSaveSearch()
            navigate(`/${returnUrl!}`, { replace: true });
        }
    }, [dispatch, returnUrl, IDSaveSearch, navigate]);

    return (
        <>
            <EstimatesNavBar handleViewAll={handleViewAll} />
            <div className={`panel-list-unshow${viewAll ? '-show' : ''}`}>
                <ShowAllSelected setViewAll={setViewAll} ariaExpanded={false} />
            </div>
            <Grid container className={`tab-container-estimate`} spacing={4}>
                <Grid item md={3}>
                    <EstimateCollapse />
                </Grid>
                <Grid item md={9}>
                    <EstimatesTabs />
                </Grid>
            </Grid>
        </>
    );
}

export default Estimates;
