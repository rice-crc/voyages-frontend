import EnslavedPageScrolling from '@/components/FunctionComponents/Scrolling/EnslavedPageScrolling';
import HeaderEnslavedNavBar from '@/components/FunctionComponents/Header/HeaderEnslavedNavBar';
import HeaderLogoSearch from '@/components/FunctionComponents/Header/HeaderSearchLogo';
import React from 'react';

import '@/style/page-past.scss';

const EnslavedHomePage: React.FC = () => {
  return (
    <div id="enslaved-home-page">
      <HeaderLogoSearch />
      <HeaderEnslavedNavBar />
      <EnslavedPageScrolling />
    </div>
  );
};

export default EnslavedHomePage;
