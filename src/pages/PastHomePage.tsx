import React from 'react';
import PastPeopleIntro from '@/components/PresentationComponents/Intro/PastPeopleIntro';
import HeaderPeopleNavBar from '@/components/NavigationComponents/Header/HeaderPeopleNavBar';

const PastHomePage: React.FC = () => {
  return (
    <>
      <HeaderPeopleNavBar />
      <PastPeopleIntro />
    </>
  );
};

export default PastHomePage;
