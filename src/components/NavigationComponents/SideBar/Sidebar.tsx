// Sidebar.tsx
import React, { useEffect } from 'react';
import '@/style/contributeContent.scss';
import { useNavigation } from '@/hooks/useNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { displayButton } from '@/utils/functions/contribuitePath';
import { loadUserFromStorage } from '@/redux/getAuthUserSlice';

const SidebarContribute: React.FC = () => {
  const {
    handleClickGuidelines,
    handleSignInClick,
    handleLogout,
    handleClickSideBar,
  } = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.getAuthUserSlice);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);

  return (
    <div className="contribute-sidebar">
      <ul>
        <li>
          <span onClick={handleClickGuidelines}>
            Guidelines for Contributors
          </span>
        </li>
        {!user ? (
          <li>
            <span onClick={handleSignInClick}>Sign In</span>
          </li>
        ) : (
          <>
            <li>
              <span onClick={() => handleClickSideBar('')}>
                Contribute Home
              </span>
              <ul className="contribute-sub-sidebar">
                {displayButton.map((btn) => (
                  <li key={btn.nameBtn}>
                    <span onClick={() => handleClickSideBar(btn.path)}>
                      {btn.nameBtn}
                    </span>{' '}
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <span onClick={handleLogout}>Log Out</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SidebarContribute;
