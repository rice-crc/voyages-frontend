// Sidebar.tsx
import React from 'react';
import '@/style/contributeContent.scss';
import {Link} from 'react-router-dom';
import {ACCOUNTS, CONTRIBUTE} from '@/share/CONST_DATA';
interface SidebarContributeProps{
  handleClickGuidelines: ()=>void
  handleSignInClick: () => void
}

const SidebarContribute: React.FC<SidebarContributeProps> = ({handleClickGuidelines,handleSignInClick}) => {

  return (
    <div className="contribute-sidebar">
      <ul>
      <li><span onClick={handleClickGuidelines}>Guidelines for Contributors</span></li> 
      <li><span onClick={handleSignInClick}>Sign In</span></li> 
      </ul>
    </div>
  );
};

export default SidebarContribute;
