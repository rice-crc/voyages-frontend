import React, { useState } from "react";
import HeaderLogoSearch from "./header/HeaderSearchLogo";
import HeaderNavBar from "./header/HeaderNavBar";
import ScrollPage from "./voyagePage/ScrollPage";
const HOME: React.FC = () => {
  const [isFilter, setIsFilter] = useState<boolean>(false);
  return (
    <>
      <HeaderLogoSearch />
      <HeaderNavBar />
      <ScrollPage />
    </>
  );
};

export default HOME;
