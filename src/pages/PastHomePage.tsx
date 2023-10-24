import React from 'react';
import PastPeopleIntro from '@/components/PresentationComponents/Intro/PastPeopleIntro';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import HeaderPeopleNavBar from '@/components/NavigationComponents/Header/HeaderPeopleNavBar';

const PastHomePage: React.FC = () => {
  return (
    <>
      <HeaderLogoSearch />
      <HeaderPeopleNavBar />
      <PastPeopleIntro />
    </>
  );
};

export default PastHomePage;
