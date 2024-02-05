
import { Divider } from "@mui/material";
import Flag from "./Flag";
import Regions from "./Regions";
import TimeFrame from "./TimeFrame";
import QueryLink from "./QueryLink";
import EstimatesNavBar from "./EstimatesNavBar";
import EstimatesTabs from "./EstimatesTabs";
import { Grid } from '@mui/material';

const Estimates = () => {
    return (
        <>
            <EstimatesNavBar />
            <Grid container className="tab-container-estimate" spacing={2}>
                <Grid item xs={2}>
                    <TimeFrame />
                    <Flag />
                    <Regions />
                    <QueryLink />
                </Grid>

                <Grid item xs={10}>
                    <EstimatesTabs />
                </Grid>
            </Grid></>

    )
}

export default Estimates;