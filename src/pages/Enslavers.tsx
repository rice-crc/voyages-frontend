import HeaderEnslaversNavBar from '@/components/PastPeople/Enslavers/HeaderEnslavers/HeaderEnslaversNavBar';
import HeaderLogoSearch from '@/components/header/HeaderSearchLogo';
import React from 'react';

const EnslaversHomePage: React.FC = () => {
  return (
    <div id="enslaved-home-page">
      <HeaderLogoSearch />
      <HeaderEnslaversNavBar />
    </div>
  );
};

export default EnslaversHomePage;
