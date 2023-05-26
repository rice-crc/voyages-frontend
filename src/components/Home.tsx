import React from 'react';
import NavBar from './header/NavBar';
import Scatter from './VoyagePage/Results/Scatter';
import HeaderNavBar from './header/HeaderNavBar';

const HOME: React.FC = () => {
  return (
    <>
    <HeaderNavBar/>
    <div style={{marginTop: 30}}></div>
    <NavBar/>
    <div style={{marginTop: 30}}></div>
   <Scatter/>
   </>
 
  );
};

export default HOME;