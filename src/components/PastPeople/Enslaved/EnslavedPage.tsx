import { Box, Grid } from "@mui/material";
import "@/style/page-past.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  BaseFilter,
  DataSetCollectionProps,
} from "@/share/InterfactTypesDatasetCollection";
import {
  setBaseFilterPeopleDataKey,
  setBaseFilterPeopleDataSetValue,
  setBaseFilterPeopleDataValue,
  setDataSetPeopleHeader,
  setPeopleBlocksMenuList,
  setPeopleStyleName,
  setPeopleTextIntro,
} from "@/redux/getPeopleDataSetCollectionSlice";
import { useNavigate } from "react-router-dom";

const EnslavedPage = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { value, styleName, textIntroduce } = useSelector(
    (state: RootState) => state.getPeopleDataSetCollection
  );
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const handleSelectEnslavedDataset = (
    base_filter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[]
  ) => {
    for (const base of base_filter) {
      dispatch(setBaseFilterPeopleDataKey(base.var_name));
      dispatch(setBaseFilterPeopleDataValue(base.value));
    }
    dispatch(setBaseFilterPeopleDataSetValue(base_filter));
    dispatch(setDataSetPeopleHeader(textHeder));
    dispatch(setPeopleTextIntro(textIntro));
    dispatch(setPeopleStyleName(styleName));
    dispatch(setPeopleBlocksMenuList(blocks));
    const url = `/past/enslaved/${styleName}`;
    navigate(url);
  };
  return (
    <>
      {/* Filter */}
      <div className="page" id="main-enslaved-home">
        <Box
        // sx={{
        //   flexGrow: 1,
        //   // marginTop: {
        //   //   sm: "2rem",
        //   //   md: "8%",
        //   // },
        // }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} className="grid-enslaved-introduction">
              <div>{textIntroduce}</div>
              <div className="btn-enslave-box">
                {value.map((item: DataSetCollectionProps, index: number) => {
                  const { base_filter, headers, style_name, blocks } = item;
                  return (
                    <div
                      onClick={() =>
                        handleSelectEnslavedDataset(
                          base_filter,
                          headers.label,
                          headers.text_introduce,
                          style_name,
                          blocks
                        )
                      }
                      key={`${item}-${index}`}
                      className="enslave-nav-btn"
                    >
                      {headers.label}
                    </div>
                  );
                })}
              </div>
            </Grid>
          </Grid>
        </Box>

        <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
      </div>
    </>
  );
};

export default EnslavedPage;
