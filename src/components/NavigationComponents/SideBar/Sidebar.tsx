// Sidebar.tsx
import React from 'react';
import '@/style/contributeContent.scss';

const SidebarContribute: React.FC = () => {
  return (
    <div className="contribute-sidebar">
      <ul>
        <li><a href="#guidelines">Guidelines for Contributors</a></li>
        <li><a href="#sign-in">Sign In</a></li>
      </ul>
    </div>
  );
};

export default SidebarContribute;
