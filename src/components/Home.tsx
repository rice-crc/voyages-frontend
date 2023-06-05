import React, { useState, useEffect } from "react";
import HeaderLogoSearch from "./header/HeaderSearchLogo";
import HeaderNavBar from "./header/HeaderNavBar";
import CanscandingMenu from "./canscanding/CanscandingMenu";
import { Hidden } from "@mui/material";
import ScrollPage from "./ScrollPage";

const HOME: React.FC = () => {
  const [isFilter, setIsFilter] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFilter(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPageCount = 5;
  useEffect(() => {
    const handleWheel = (event: any) => {
      const { deltaY } = event;
      const nextPage = deltaY > 0 ? currentPage + 1 : currentPage - 1;

      if (nextPage >= 1 && nextPage <= totalPageCount) {
        setCurrentPage(nextPage);
      }
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentPage]);

  return (
    <div>
      <HeaderLogoSearch />
      <HeaderNavBar isFilter={isFilter} setIsFilter={setIsFilter} />
      <Hidden smDown>
        {isFilter && <CanscandingMenu isFilter={isFilter} />}
      </Hidden>
      <ScrollPage isFilter={isFilter} />
    </div>
  );
};

export default HOME;
