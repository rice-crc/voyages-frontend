import React, { useState, useEffect } from "react";
import HeaderLogoSearch from "./header/HeaderSearchLogo";
import HeaderNavBar from "./header/HeaderNavBar";
import ScrollPage from "./VoyagePage/ScrollPage";

const HOME: React.FC = () => {
  const [isFilter, setIsFilter] = useState<boolean>(false);
  return (
    <div>
      <HeaderLogoSearch />
      <HeaderNavBar isFilter={isFilter} setIsFilter={setIsFilter} />
      <ScrollPage isFilter={isFilter} setIsFilter={setIsFilter} />
    </div>
  );
};

export default HOME;
