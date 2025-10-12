import React from 'react';

import HeaderPeopleNavBar from '@/components/NavigationComponents/Header/HeaderPeopleNavBar';
import PastPeopleIntro from '@/components/PresentationComponents/Intro/PastPeopleIntro';

const PastHomePage: React.FC = () => {
  return (
    <>
      <HeaderPeopleNavBar />
      <PastPeopleIntro />
    </>
  );
};

export default PastHomePage;
