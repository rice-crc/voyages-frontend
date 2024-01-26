
import { Divider } from "@mui/material";
import EstimatesMap from "./EstimatesMap";
import Flag from "./Flag";
import Regions from "./Regions";
import TablesEstimates from "./TablesEstimates";
import TimeFrame from "./TimeFrame";
import TimeLine from "./TimeLine";
import QueryLink from "./QueryLink";



const Estimates = () => {
    return (
        <div>
            Estimates
            <TimeFrame />
            <Flag />
            <Regions />
            <QueryLink />
            <Divider />
            <TablesEstimates />
            <TimeLine />
            <EstimatesMap />
        </div>
    )
}

export default Estimates;