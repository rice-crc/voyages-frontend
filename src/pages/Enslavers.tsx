import EnslaversScrolling from '@/components/PastPeople/Enslavers/EnslaversScrolling';
import HeaderEnslaversNavBar from '@/components/PastPeople/Enslavers/HeaderEnslavers/HeaderEnslaversNavBar';
import HeaderLogoSearch from '@/components/header/HeaderSearchLogo';
import React from 'react';

const EnslaversHomePage: React.FC = () => {
  return (
    <div id="enslavers-home-page">
      <HeaderLogoSearch />
      <HeaderEnslaversNavBar />
      <EnslaversScrolling />
    </div>
  );
};

export default EnslaversHomePage;
