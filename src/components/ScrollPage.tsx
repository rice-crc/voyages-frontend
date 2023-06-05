import { useState, useEffect, FunctionComponent } from "react";
import { Container, Box } from "@mui/material";
import Scatter from "./VoyagePage/Results/Scatter";
import BarGraph from "./VoyagePage/Results/BarGraph";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setIsOpenDialog } from "@/redux/getScrollPageSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  RangeSliderState,
  currentPageInitialState,
} from "@/share/InterfaceTypes";
import { setIsChange, setRangeValue } from "@/redux/rangeSliderSlice";
interface ScrollPageProps {
  isFilter: boolean;
}

const ScrollPage: FunctionComponent<ScrollPageProps> = ({ isFilter }) => {
  const dispatch: AppDispatch = useDispatch();
  const { currentPage, isOpenDialog } = useSelector(
    (state: RootState) => state.getScrollPage as currentPageInitialState
  );
  const pageList = ["scatter", "bar", "pie", "table", "pivot", "map"];
  const totalPageCount = pageList.length;

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const { deltaY } = event;
      const nextPage = deltaY > 0 ? currentPage + 1 : currentPage - 1;
      if (nextPage >= 1 && nextPage <= totalPageCount) {
        dispatch(setCurrentPage(nextPage));
        smoothScrollToTop();
      }
      dispatch(setIsOpenDialog(false));
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
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

  let displayPage;
  if (currentPage === 1) {
    displayPage = (
      <Box>
        <Scatter />
      </Box>
    );
  } else if (currentPage === 2) {
    displayPage = (
      <Box>
        <BarGraph />
      </Box>
    );
  } else if (currentPage === 3) {
    displayPage = <Box>PIE</Box>;
  } else if (currentPage === 4) {
    displayPage = <Box>Table</Box>;
  } else if (currentPage === 5) {
    displayPage = <Box>PIVOT</Box>;
  } else if (currentPage === 6) {
    displayPage = <Box>MAP</Box>;
  }

  return (
    <div
      style={{
        position: "relative",
        top: isFilter ? -20 : 200,
      }}
      id="content-container"
    >
      <Container>{displayPage}</Container>
    </div>
  );
};

export default ScrollPage;
