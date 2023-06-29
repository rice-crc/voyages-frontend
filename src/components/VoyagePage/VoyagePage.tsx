import { RootState } from "@/redux/store";
import "@/style/page.scss";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

const VoyagesPage = () => {
  const { value, selectDataset, textIntroduce } = useSelector(
    (state: RootState) => state.getDataSetMenu
  );
  let textIntroduceData = textIntroduce;
  if (selectDataset === value[0].label) {
    textIntroduceData = value[0].text_introduce;
  } else if (selectDataset === value[1].label) {
    textIntroduceData = value[1].text_introduce;
  } else if (selectDataset === value[2].label) {
    textIntroduceData = value[2].text_introduce;
  }

  let classStyle = "main-voyagepage";
  if (selectDataset === value[0].label) {
    classStyle = "main-voyagepage";
  } else if (selectDataset === value[1].label) {
    classStyle = "main-voyagepage-Trans-atlantic";
  } else if (selectDataset === value[2].label) {
    classStyle = "main-voyagepage-intra-american";
  }

  let backgroundColor = "main-voyagepage";
  if (selectDataset === value[0].label) {
    backgroundColor = "rgba(147, 208, 203, 0.6)";
  } else if (selectDataset === value[1].label) {
    backgroundColor = "rgba(56, 116, 203, 0.9)";
  } else if (selectDataset === value[2].label) {
    backgroundColor = "rgba(171, 71, 188, 0.8)";
  }
  return (
    <div className="page" id={classStyle}>
      <Grid className="main-script-text-box">
        <span
          className="main-script-text"
          style={{
            backgroundColor: backgroundColor,
            color: selectDataset === value[0].label ? "#000000" : "#ffffff",
          }}
        >
          {textIntroduceData}
        </span>
      </Grid>
    </div>
  );
};

export default VoyagesPage;
