import { useEffect, FunctionComponent } from "react";
import { Container, Box } from "@mui/material";
import Scatter from "./Results/Scatter";
import BarGraph from "./Results/BarGraph";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setIsOpenDialog } from "@/redux/getScrollPageSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { currentPageInitialState } from "@/share/InterfaceTypes";
import { ButtonNav } from "@/styleMUI";
import VoyagesPage from "./VoyagePage";
import "@/style/page.scss";

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
    const handleWheel = (event: WheelEvent) => {
      const { deltaY } = event;
      const nextPage = deltaY > 0 ? currentPage + 1 : currentPage - 1;
      if (nextPage >= 1 && nextPage <= totalPageCount) {
        dispatch(setCurrentPage(nextPage));
        smoothScrollToTop();
        dispatch(setIsOpenDialog(false));
      }
      setIsFilter(false);
      dispatch(setIsOpenDialog(false));
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentPage, isOpenDialog]);

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

  const smoothScrollToTop = () => {
    const contentContainer = document.getElementById("content-container");
    if (contentContainer) {
      contentContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePageNavigation = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  let displayPage;
  if (currentPage === 1) {
    displayPage = <VoyagesPage />;
  } else if (currentPage === 2) {
    displayPage = (
      <Box>
        <Scatter />
      </Box>
    );
  } else if (currentPage === 3) {
    displayPage = (
      <Box>
        <BarGraph />
      </Box>
    );
  } else if (currentPage === 4) {
    displayPage = (
      <Box>
        <h1 style={{ marginTop: 50 }}>PIE</h1>
      </Box>
    );
  } else if (currentPage === 5) {
    displayPage = (
      <Box>
        <h1 style={{ marginTop: 50 }}>TABLE</h1>
      </Box>
    );
  } else if (currentPage === 6) {
    displayPage = (
      <Box>
        <h1 style={{ marginTop: 50 }}>PIVOT</h1>
      </Box>
    );
  } else if (currentPage === 7) {
    displayPage = (
      <Box>
        <h1 style={{ marginTop: 50 }}>MAP</h1>
      </Box>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        top: isFilter ? 245 : 200,
      }}
      id="content-container"
    >
      <div className="navbar-wrapper">
        <nav className="nav-button">
          {pageList.map((page, index) => {
            const buttonIndex = totalPageCount - index;
            return (
              <ButtonNav
                key={`${page}-${buttonIndex}`}
                onClick={() => handlePageNavigation(buttonIndex)}
                variant={currentPage === buttonIndex ? "contained" : "outlined"}
              >
                {page.toUpperCase()}
              </ButtonNav>
            );
          })}
        </nav>
      </div>
      {currentPage !== 1 ? <Container>{displayPage}</Container> : displayPage}

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
