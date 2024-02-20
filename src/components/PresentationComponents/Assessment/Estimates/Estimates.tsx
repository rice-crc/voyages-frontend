import EstimatesNavBar from "./EstimatesNavBar";
import EstimatesTabs from "./EstimatesTabs";
import { Grid } from '@mui/material';
import EstimateCollapse from "./EstimateCollapse";
import ShowAllSelected from "./ShowAllSelected";
import { useState } from "react";

const Estimates = () => {
    const [viewAll, setViewAll] = useState(false);

    const handleViewAll = () => {
        setViewAll(!viewAll);
    };

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
