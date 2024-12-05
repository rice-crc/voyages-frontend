
import React, { useState } from 'react';
import ContributeNavBar from './ContributeNavBar';
import ContributeContent from './ContributeContent';
import Sidebar from '@/components/NavigationComponents/SideBar/Sidebar';
import '@/style/contributeContent.scss';

const Contribute: React.FC = () => {

  return (
    <>
      <ContributeNavBar />
      <div className='contribuite-main-content'>
        <Sidebar />
        <ContributeContent />
      </div>
    </>
  )
}

export default Contribute;