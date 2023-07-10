import { Grid, Hidden } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEnslavedPage } from "@/redux/getScrollEnslavedPageSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ButtonNav } from "@/styleMUI";
import {
  getColorBTNBackgroundEnslaved,
  getColorBoxShadowEnslaved,
} from "@/utils/getColorStyle";
import EnslavedPage from "./EnslavedPage";
import EnslavedTable from "./EnslavedTable";
import "@/style/page.scss";

const EnslavePageScrolling = () => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { styleName, blocks } = useSelector(
    (state: RootState) => state.getPeopleDataSetCollection
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const newBlock = [...blocks].reverse();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const totalPageCount = newBlock?.length;

  const handlePageNavigation = (page: number) => {
    dispatch(setCurrentEnslavedPage(page));
  };
  const displayPage = (
    <motion.div
      initial={"initial"}
      animate={"animate"}
      variants={
        currentEnslavedPage - 1 > -1
          ? pageVariantsFromTop
          : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {currentEnslavedPage === 1 && <EnslavedPage />}
      {currentEnslavedPage === 2 && <EnslavedTable />}
    </motion.div>
  );

  return (
    <div
      style={{
        position: "relative",
        top: !isSmallScreen
          ? 130
          : currentEnslavedPage !== 1 && isFilter
          ? 230
          : 170,
        padding: currentEnslavedPage !== 1 ? "0 20px" : "",
      }}
      id="content-container"
    >
      <Hidden>
        <div className="navbar-wrapper">
          <nav className="nav-button-enslaved">
            {newBlock.map((page, index) => {
              const buttonIndex = totalPageCount - index;
              return (
                <ButtonNav
                  key={`${page}-${buttonIndex}`}
                  onClick={() => handlePageNavigation(buttonIndex)}
                  style={{
                    width: "80px",
                    height: "32",
                    backgroundColor: getColorBTNBackgroundEnslaved(styleName),
                    boxShadow: getColorBoxShadowEnslaved(styleName),
                    fontSize: currentEnslavedPage === buttonIndex ? 15 : 14,
                    color:
                      currentEnslavedPage === buttonIndex ? "white" : "black",
                    fontWeight: currentEnslavedPage === buttonIndex ? 900 : 600,
                  }}
                  variant={
                    currentEnslavedPage === buttonIndex
                      ? "contained"
                      : "outlined"
                  }
                >
                  {page.toUpperCase()}
                </ButtonNav>
              );
            })}
          </nav>
        </div>
      </Hidden>
      <Grid id="content-container">{displayPage}</Grid>
    </div>
  );
};

export default EnslavePageScrolling;

const pageVariantsFromTop = {
  initial: { opacity: 0, y: -1000 },
  animate: { opacity: 1, y: 0 },
};
const pageVariantsFromBottom = {
  initial: { opacity: -1000, y: 0 },
  animate: { opacity: 0, y: 1 },
};
