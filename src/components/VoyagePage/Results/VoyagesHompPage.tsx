import { RootState } from "@/redux/store";
import {
  getIdStyleName,
  getIntroBackgroundColor,
  getTextColor,
} from "@/utils/functions/getColorStyle";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import "@/style/page.scss";

const VoyagesHompPage = () => {
  const { styleName, textIntroduce } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <div className="page" id={getIdStyleName(styleName)}>
      <Grid className="main-script-text-box">
        <span
          className="main-script-text"
          style={{
            backgroundColor: getIntroBackgroundColor(styleName),
            color: getTextColor(styleName),
          }}
        >
          {textIntroduce}
        </span>
      </Grid>

      <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
    </div>
  );
};
export default VoyagesHompPage;
