import { RootState } from "@/redux/store";
import { TYPESOFDATASET } from "@/share/InterfaceTypes";
import "@/style/page.scss";
import {
  getIdStyleName,
  getIntroBackgroundColor,
  getTextColor,
} from "@/utils/getColorStyle";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

const VoyagesPage = () => {
  const { styleName, textIntroduce } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

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
    </div>
  );
};

export default VoyagesPage;
