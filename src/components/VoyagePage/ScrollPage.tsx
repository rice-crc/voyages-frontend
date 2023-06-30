import { useEffect, useState } from "react";
import { Grid, Hidden } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setIsOpenDialog } from "@/redux/getScrollPageSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  CurrentPageInitialState,
  TYPESOFDATASET,
} from "@/share/InterfaceTypes";
import { ButtonNav } from "@/styleMUI";
import VoyagesPage from "./VoyagePage";
import "@/style/page.scss";
import Scatter from "./Results/Scatter";
import BarGraph from "./Results/BarGraph";
import Table from "./Results/Table";
import PieGraph from "./Results/PieGraph";
import { getColorBackground, getColorBoxShadow } from "@/utils/getColorStyle";

const ScrollPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [isShowScrollTopButton, setShowScrollTopButton] = useState(false);
  const { styleName, blocks } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const newBlock = [...blocks].reverse();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const totalPageCount = newBlock?.length;

  // Scroll to next page and page hide other page
  // useEffect(() => {
  //   const handleTouchStart = (event: TouchEvent) => {
  //     const touch = event.touches[0]; // Get the first touch point
  //     console.log("touch", touch);
  //     const initialTouchX = touch.clientX; // Store the initial touch X coordinate
  //     const initialTouchY = touch.clientY; // Store the initial touch Y coordinate

  //     // Store the initial touch position in a variable or state
  //     // Example: setInitialTouchPosition({ x: initialTouchX, y: initialTouchY });
  //   };

  //   const handleTouchMove = (event: TouchEvent) => {
  //     // Calculate the touch delta
  //     // Determine the scrolling direction
  //     // Scroll to the next page if necessary
  //   };

  //   const handleTouchEnd = () => {
  //     // Reset any stored touch position or values
  //   };

  //   const handleScroll = (event: WheelEvent) => {
  //     const { deltaY } = event;
  //     const nextPage = deltaY > 0 ? currentPage + 1 : currentPage - 1;

  //     setTimeout(() => {
  //       if (nextPage >= 1 && nextPage <= totalPageCount) {
  //         dispatch(setCurrentPage(nextPage));
  //         smoothScrollToTop();
  //         dispatch(setIsOpenDialog(false));
  //       }
  //       setIsFilter(false);
  //       dispatch(setIsOpenDialog(false));
  //     }, 400);
  //   };
  //   window.addEventListener("wheel", handleScroll);
  //   window.addEventListener("touchstart", handleTouchStart);
  //   window.addEventListener("touchmove", handleTouchMove);
  //   window.addEventListener("touchend", handleTouchEnd);
  //   return () => {
  //     window.removeEventListener("wheel", handleScroll);
  //     window.removeEventListener("touchstart", handleTouchStart);
  //     window.removeEventListener("touchmove", handleTouchMove);
  //     window.removeEventListener("touchend", handleTouchEnd);
  //   };
  // }, [currentPage, isOpenDialog]);

  // const smoothScrollToTop = () => {
  //   const contentContainer = document.getElementById("content-container");
  //   if (contentContainer) {
  //     contentContainer.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // };

  /*  Scrool to next page and also still see prev page 2*/
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
  }, []);

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
      {currentPage === 4 && <PieGraph />}
      {currentPage === 5 && <Table />}
      {currentPage === 6 && <h1>PIVOT</h1>}
      {currentPage === 7 && <h1>MAP</h1>}
    </motion.div>
  );

  return (
    <div
      style={{
        position: "relative",
        top: !isSmallScreen ? 130 : currentPage !== 1 && isFilter ? 230 : 170,
        padding: currentPage !== 1 ? "0 20px" : "",
      }}
      id="content-container"
    >
      <Hidden>
        <div className="navbar-wrapper">
          <nav className="nav-button">
            {newBlock.map((page, index) => {
              const buttonIndex = totalPageCount - index;
              return (
                <ButtonNav
                  key={`${page}-${buttonIndex}`}
                  onClick={() => handlePageNavigation(buttonIndex)}
                  style={{
                    width: "80px",
                    height: "32",
                    backgroundColor: getColorBackground(styleName),
                    boxShadow: getColorBoxShadow(styleName),
                    fontSize: currentPage === buttonIndex ? 15 : 14,
                    color: currentPage === buttonIndex ? "white" : "black",
                    fontWeight: currentPage === buttonIndex ? 900 : 600,
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
