
import React, {useState} from 'react';
import ContributeNavBar from './ContributeNavBar';
import ContributeContent from './ContributeContent';
import Sidebar from '@/components/NavigationComponents/SideBar/Sidebar';
import '@/style/contributeContent.scss';
import {useNavigate} from 'react-router-dom';
import {ACCOUNTS, CONTRIBUTE} from '@/share/CONST_DATA';

const Contribute: React.FC = () => {
  const [viewContent, setViewContent] = useState("signin"); 
  const navigate = useNavigate();


  const handleClickGuidelines = () => {
    setViewContent("guidelines");
    navigate(`/${CONTRIBUTE}guidelines/`);
  };

  const handleSignInClick = () => {
    setViewContent("signin");
    navigate(`/${ACCOUNTS}signin`);
  };

  const handleSignUpClick = () => {
    setViewContent("signup");
    navigate(`/${ACCOUNTS}signup`);
  };

    return (
        <> 
        <ContributeNavBar/>
        <div className='contribuite-main-content'>
        <Sidebar handleClickGuidelines={handleClickGuidelines} handleSignInClick={handleSignInClick}/>
        <ContributeContent viewContent={viewContent} handleSignUpClick={handleSignUpClick}/>
      </div>
        </>
    )
}

export default Contribute;