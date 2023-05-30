import React, { useState } from "react";
import NavBar from "./header/NavBar";
import Scatter from "./VoyagePage/Results/Scatter";
import HeaderNavBar from "./header/HeaderNavBar";
import HeaderLogoSearch from "./header/HeaderSearchLogo";
import { Container } from "@mui/system";

const HOME: React.FC = () => {
  const [isFilter, setIsFilter] = useState<boolean>(false);
  return (
    <div style={{ padding: "0 20px" }}>
      <HeaderLogoSearch />
      <HeaderNavBar isFilter={isFilter} setIsFilter={setIsFilter} />
      <NavBar isFilter={isFilter} setIsFilter={setIsFilter} />
      <Container>
        <Scatter />
      </Container>
    </div>
  );
};

export default HOME;
