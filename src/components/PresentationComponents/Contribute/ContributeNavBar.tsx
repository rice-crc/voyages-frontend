import '@/style/estimates.scss';
import '@/style/Nav.scss';
import { FunctionComponent } from 'react';
import {  RootState, } from '@/redux/store';
import {  useSelector, } from 'react-redux';
import LanguagesDropdown from '@/components/SelectorComponents/DropDown/LanguagesDropdown';
import { translationLanguagesContribute} from '@/utils/functions/translationLanguages';
import HeaderLogoContribute from '@/components/NavigationComponents/Header/HeaderLogoContribute';

interface ContributeNavBarProps {
   
}

const ContributeNavBar: FunctionComponent<ContributeNavBarProps> = () => {
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);
    const translatedcontribute = translationLanguagesContribute(languageValue)

    return (
        <div className="nav-header">
            <span className='header-logo-icon-estimate'>
                <div className='logo-header-estimate'>
                    <HeaderLogoContribute />
                    <div>{translatedcontribute.header}</div>
                </div>
                <div> <LanguagesDropdown /></div>
            </span>
            <div className="navbar-subtitle flex-navbar">
                <div className='flex-navbar'>
                <div>{translatedcontribute.loginTitle}</div>
                </div>
            </div>
        </div>
    )
}
export default ContributeNavBar