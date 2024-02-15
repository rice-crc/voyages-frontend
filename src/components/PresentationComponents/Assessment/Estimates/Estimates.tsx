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
            {viewAll && <div className="tab-container-estimate"><ShowAllSelected setViewAll={setViewAll} ariaExpanded={viewAll} /></div>}
            <Grid container className={`tab-container-estimate${viewAll ? '-viewall' : ''}`} spacing={2}>
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
