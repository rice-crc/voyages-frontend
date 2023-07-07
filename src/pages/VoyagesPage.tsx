import React from "react";
import HeaderLogoSearch from "../components/header/HeaderSearchLogo";
import HeaderNavBar from "../components/header/HeaderNavBar";
import ScrollPage from "@/components/VoyagePage/ScrollPage";

const VoyagesPage: React.FC = () => {
  return (
    <>
      <HeaderLogoSearch />
      <HeaderNavBar />
      <ScrollPage />
    </>
  );
};

export default VoyagesPage;
