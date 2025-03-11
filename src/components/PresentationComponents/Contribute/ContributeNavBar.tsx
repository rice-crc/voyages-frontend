import '@/style/contributeContent.scss';
import '@/style/Nav.scss';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import LanguagesDropdown from '@/components/SelectorComponents/DropDown/LanguagesDropdown';
import { translationLanguagesContribute } from '@/utils/functions/translationLanguages';
import HeaderLogoContribute from '@/components/NavigationComponents/Header/HeaderLogoContribute';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ButtonToggle from '@/components/SelectorComponents/ButtonComponents/ButtonToggle';
interface ContributeNavBarProps {
  handleDrawerOpen: () => void;
}

const ContributeNavBar = ({ handleDrawerOpen }: ContributeNavBarProps) => {
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );

  const { user } = useSelector((state: RootState) => state.getAuthUserSlice);
  const translatedcontribute = translationLanguagesContribute(languageValue);


  return (
    <div className="nav-header-contribute">
      <span className="header-logo-icon-estimate">
        <div className="logo-header-estimate">
        <ButtonToggle handleDrawerOpen={handleDrawerOpen} />
          <HeaderLogoContribute />
          <div>{translatedcontribute.header}</div>
        </div>
        <div>
          <LanguagesDropdown />
        </div>
      </span>
      <div className="navbar-subtitle-contribuite flex-navbar">
        <div className="flex-navbar">
          {user ? (
            <div className="navbar-subtitle-contribuite  flex">
              <div className="navbar-subitem">
                Welcome, {user.userName}.
                <Link className="navbar-subitem-link" to="/contribute/">
                  {translatedcontribute.contributeContributeHome}
                </Link>{' '}
                |
                <Link
                  className="navbar-subitem-link"
                  to="/accounts/password_change/"
                >
                  {translatedcontribute.contributeChangePassword}
                </Link>{' '}
                |
                <Link className="navbar-subitem-link" to="/accounts/logout/">
                  {translatedcontribute.contributeLogOut}
                </Link>
              </div>
            </div>
          ) : (
            <div>{translatedcontribute.loginTitle}</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ContributeNavBar;
