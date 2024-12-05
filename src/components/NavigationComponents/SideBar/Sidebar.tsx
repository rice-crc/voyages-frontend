// Sidebar.tsx
import React from 'react';
import '@/style/contributeContent.scss';
import { useNavigation } from '@/hooks/useNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { displayButton } from '@/utils/functions/contribuitePath';

const SidebarContribute: React.FC = () => {
  const {
    handleClickGuidelines,
    handleSignInClick,
    handleLogout,
  } = useNavigation();
  const { user } = useSelector(
    (state: RootState) => state.getAuthUserSlice
  );


  return (
    <div className="contribute-sidebar">
      <ul>
        <li><span onClick={handleClickGuidelines}>Guidelines for Contributors</span></li>
        {!user ? <li><span onClick={handleSignInClick}>Sign In</span></li> : <><li><span >Contribute Home</span>
          <ul className="contribute-sub-sidebar">
            {displayButton.map(btn => (
              <li key={btn.nameBtn}><span >{btn.nameBtn}</span>  </li>
            ))}
          </ul>
        </li>
          <li><span onClick={handleLogout}>Log Out</span></li></>}
      </ul>
    </div>
  );
};

export default SidebarContribute;
