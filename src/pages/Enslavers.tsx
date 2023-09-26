import EnslaversScrolling from '@/components/FunctionComponents/Scrolling/EnslaversScrolling';
import HeaderEnslaversNavBar from '@/components/FunctionComponents/Header/HeaderEnslaversNavBar';
import HeaderLogoSearch from '@/components/FunctionComponents/Header/HeaderSearchLogo';
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
