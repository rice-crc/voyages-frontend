// Sidebar.tsx
import React, { useEffect } from 'react';
import '@/style/contributeContent.scss';
import { useNavigation } from '@/hooks/useNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getDisplayButtons } from '@/utils/functions/contribuitePath';
import { loadUserFromStorage } from '@/redux/getAuthUserSlice';
import { translationLanguagesContribute } from '@/utils/functions/translationLanguages';

const SidebarContribute: React.FC = () => {
  const {
    handleClickGuidelines,
    handleSignInClick,
    handleLogout,
    handleClickSideBar,
  } = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.getAuthUserSlice);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const translatedContribute = translationLanguagesContribute(languageValue);
  const buttons = getDisplayButtons(translatedContribute);
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);

  return (
    <div className="contribute-sidebar">
      <ul>
        <li>
          <span onClick={handleClickGuidelines}>
            {translatedContribute.contributeGuidelines}
          </span>
        </li>
        {!user ? (
          <li>
            <span onClick={handleSignInClick}>
              {translatedContribute.contributeSignInButton}
            </span>
          </li>
        ) : (
          <>
            <li>
              <span onClick={() => handleClickSideBar('')}>
                {translatedContribute.contributeContributeHome}
              </span>
              <ul className="contribute-sub-sidebar">
                {buttons.map((btn) => (
                  <li key={btn.nameBtn}>
                    <span onClick={() => handleClickSideBar(btn.path)}>
                      {btn.nameBtn}
                    </span>{' '}
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <span onClick={handleLogout}>
                {translatedContribute.contributeLogOut}
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SidebarContribute;
