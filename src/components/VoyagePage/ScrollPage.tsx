import { useEffect, FunctionComponent } from "react";
import { Grid, Hidden } from "@mui/material";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setIsOpenDialog } from "@/redux/getScrollPageSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { currentPageInitialState } from "@/share/InterfaceTypes";
import { ButtonNav } from "@/styleMUI";
import VoyagesPage from "./VoyagePage";
import "@/style/page.scss";
import Scatter from "./Results/Scatter";
import BarGraph from "./Results/BarGraph";

interface ScrollPageProps {
  isFilter: boolean;
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScrollPage: FunctionComponent<ScrollPageProps> = ({
  isFilter,
  setIsFilter,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { currentPage, isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as currentPageInitialState
  );
  const pageList = ["map", "pivot", "table", "pie", "bar", "scatter", "main"];
  const totalPageCount = pageList.length;

  // Scroll to next page and page hide other page
  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const { deltaY } = event;
      const nextPage = deltaY > 0 ? currentPage + 1 : currentPage - 1;

      setTimeout(() => {
        if (nextPage >= 1 && nextPage <= totalPageCount) {
          dispatch(setCurrentPage(nextPage));
          smoothScrollToTop();
          dispatch(setIsOpenDialog(false));
        }
        setIsFilter(false);
        dispatch(setIsOpenDialog(false));
      }, 400);
    };
    window.addEventListener("wheel", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [currentPage, isOpenDialog]);

  const smoothScrollToTop = () => {
    const contentContainer = document.getElementById("content-container");
    if (contentContainer) {
      contentContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /*  Scrool to next page and also still see prev page 2
   const scrollThreshold = 800;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setShowScrollTopButton(true);
        const nextPage = Math.floor(window.scrollY / scrollThreshold) + 1;
        dispatch(setCurrentPage(nextPage));
      } else {
        setShowScrollTopButton(false);
        dispatch(setCurrentPage(1));
      }
      dispatch(setIsOpenDialog(false));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); */

  const handlePageNavigation = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  const displayPage = (
    <motion.div
      initial={"initial"}
      animate={"animate"}
      variants={
        currentPage - 1 > -1 ? pageVariantsFromTop : pageVariantsFromBottom
      }
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {currentPage === 1 && <VoyagesPage />}
      {currentPage === 2 && <Scatter />}
      {currentPage === 3 && <BarGraph />}
      {currentPage === 4 && <h1 style={{ marginTop: 50 }}>PIE</h1>}
      {currentPage === 5 && <h1 style={{ marginTop: 50 }}>TABLE</h1>}
      {currentPage === 6 && <h1 style={{ marginTop: 50 }}>PIVOT</h1>}
      {currentPage === 7 && <h1 style={{ marginTop: 50 }}>MAP</h1>}
    </motion.div>
  );

  return (
    <div
      style={{
        position: "relative",
        top: isFilter ? 245 : 200,
        padding: currentPage !== 1 ? "0 20px" : "",
      }}
      id="content-container"
    >
      <Hidden mdDown>
        <div className="navbar-wrapper">
          <nav className="nav-button">
            {pageList.map((page, index) => {
              const buttonIndex = totalPageCount - index;
              return (
                <ButtonNav
                  key={`${page}-${buttonIndex}`}
                  onClick={() => handlePageNavigation(buttonIndex)}
                  style={{
                    backgroundColor:
                      currentPage === buttonIndex ? "#54bfb6" : "#93D0CB",
                    color: currentPage === buttonIndex ? "#000aff" : "black",
                    fontWeight: currentPage === buttonIndex ? 700 : 500,
                  }}
                  variant={
                    currentPage === buttonIndex ? "contained" : "outlined"
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

      {/* Scrolling up to next page version 2
      <Container>
        <Box className="page">
          <Scatter />
        </Box>
        <Box className="page">
          <BarGraph />
        </Box>
        <Box className="page">
          <h1>PIE</h1>
        </Box>
        <Box className="page">
          <h1>TABLE</h1>
        </Box>
        <Box className="page">
          <h1>PIVOT</h1>
        </Box>
        <Box className="page">
          <h1>MAP</h1>
        </Box>
      </Container> */}
    </div>
  );
};

export default ScrollPage;

const pageVariantsFromTop = {
  initial: { opacity: 0, y: -1000 },
  animate: { opacity: 1, y: 0 },
};
const pageVariantsFromBottom = {
  initial: { opacity: -1000, y: 0 },
  animate: { opacity: 0, y: 1 },
};
