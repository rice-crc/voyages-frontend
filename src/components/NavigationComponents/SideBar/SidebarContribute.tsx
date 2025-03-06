import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { loadUserFromStorage } from '@/redux/getAuthUserSlice';
import { translationLanguagesContribute } from '@/utils/functions/translationLanguages';
import { getDisplayButtons } from '@/utils/functions/contribuitePath';
import StyledDrawer from '@/styleMUI/StyledDrawer';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {  ExitToApp, AccountCircleRounded, Home, Diversity3 } from '@mui/icons-material';
import { useNavigation } from '@/hooks/useNavigation';
interface SidebarContributeProps {
  openSideBar: boolean;
}

const SidebarContribute: React.FC<SidebarContributeProps> = ({ openSideBar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.getAuthUserSlice);
  const {
    handleClickGuidelines,
    handleSignInClick,
    handleLogout,
    handleClickSideBar,
  } = useNavigation();
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  const translatedContribute = translationLanguagesContribute(languageValue);
  const buttons = getDisplayButtons(translatedContribute);


  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);

  return (

    <StyledDrawer  variant="permanent" anchor="left" open={openSideBar} lang={languageValue}>
      <List>
        <ListItem  onClick={handleClickGuidelines}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          {openSideBar && <ListItemText primaryTypographyProps={{style: {fontSize: '0.90rem', fontWeight: '500'}}} primary={translatedContribute.contributeGuidelines} />}
        </ListItem>
        {user ? (
          <>
            <ListItem  onClick={() => handleClickSideBar('')}>
              <ListItemIcon>
                <Diversity3 />
              </ListItemIcon>
              {openSideBar && <ListItemText primaryTypographyProps={{style: {fontSize: '0.90rem', fontWeight: '500'}}} primary={translatedContribute.contributeContributeHome} />}
            </ListItem>
            {buttons.map((btn) => (
              <ListItem  key={btn.nameBtn} onClick={() => handleClickSideBar(btn.path)}>
                <ListItemIcon>
                  {btn.icon}
                </ListItemIcon>
                {openSideBar && <ListItemText primaryTypographyProps={{style: {fontSize: '0.90rem', fontWeight: '500'}}} primary={btn.nameBtn} />}
              </ListItem>
            ))}

            <ListItem  onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              {openSideBar && <ListItemText primaryTypographyProps={{style: {fontSize: '0.90rem', fontWeight: '500'}}} primary={translatedContribute.contributeLogOut} />}
            </ListItem>
          </>
        ) : (
          <ListItem  onClick={handleSignInClick}>
            <ListItemIcon>
              <AccountCircleRounded />
            </ListItemIcon>
            {openSideBar && <ListItemText primaryTypographyProps={{style: {fontSize: '0.90rem', fontWeight: '500'}}} primary={translatedContribute.contributeSignInButton} />}
          </ListItem>
        )}
      </List>
    </StyledDrawer>
  );
};

export default SidebarContribute;
