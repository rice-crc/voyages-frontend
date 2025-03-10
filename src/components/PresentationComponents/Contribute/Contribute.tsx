import React, { useState } from 'react';
import ContributeNavBar from './ContributeNavBar';
import ContributeContent from './ContributeContent';
import SidebarContribute from '@/components/NavigationComponents/SideBar/SidebarContribute';
import '@/style/contributeContent.scss';

const Contribute: React.FC = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const handleDrawerOpen = () => setOpenSideBar(!openSideBar);
  return (
    <>
      <ContributeNavBar handleDrawerOpen={handleDrawerOpen} />
      <div className="contribuite-main-content">
        <SidebarContribute openSideBar={openSideBar}  />
        <ContributeContent openSideBar={openSideBar}/>
      </div>
    </>
  );
};

export default Contribute;
