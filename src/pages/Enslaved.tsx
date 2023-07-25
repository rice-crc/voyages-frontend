import EnslavedPageScrolling from '@/components/PastPeople/Enslaved/EnslavedPageScrolling';
import HeaderEnslavedNavBar from '@/components/PastPeople/Enslaved/HeaderEnslaved/HeaderEnslavedNavBar';
import HeaderLogoSearch from '@/components/header/HeaderSearchLogo';
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
