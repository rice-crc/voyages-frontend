import EnslavePageScrolling from "@/components/PastPeople/Enslaved/EnslavePageScrolling";
import HeaderEnslavedNavBar from "@/components/PastPeople/Enslaved/Header/HeaderEnslavedNavBar";
import HeaderLogoSearch from "@/components/header/HeaderSearchLogo";
import React from "react";

const EnslavedHomePage: React.FC = () => {
  return (
    <>
      <HeaderLogoSearch />
      <HeaderEnslavedNavBar />
      <EnslavePageScrolling />
    </>
  );
};

export default EnslavedHomePage;
