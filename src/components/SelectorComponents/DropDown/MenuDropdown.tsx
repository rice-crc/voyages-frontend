import { useEffect, useState } from 'react';

import '@/style/menu.scss';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { List, ListItemText, ListItemButton, Collapse } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from '@/redux/store';
import { StyledMenu } from '@/styleMUI/stylesMenu/StyledMenu';
import { menuLists } from '@/utils/functions/menuListHome';

interface MenuDropdownProps {
  open: boolean;
}

interface SubmenuState {
  [menuName: string]: boolean;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ open }) => {
  const [maxTextLength, setMaxTextLength] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({});
  const { languageValue: language } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  useEffect(() => {
    const maxLength = Math.max(
      ...menuLists.map((list) => list.name[language].length),
    );
    setMaxTextLength(maxLength * 5);
  }, [language]);

  const handleClick = (menuName: string) => {
    const isExpanded = expandedMenus[menuName];
    setExpandedMenus((prevState) => ({
      ...prevState,
      [menuName]: !isExpanded,
    }));
  };

  const displayIcon = (menuName: string) => {
    return expandedMenus[menuName] ? (
      <span className="menu_icon">
        <ExpandLess />{' '}
      </span>
    ) : (
      <span className="menu_icon">
        <ExpandMore />
      </span>
    );
  };

  // ✅ Helper function to render link (internal or external)
  const renderLink = (url: string, text: string, isExternal?: boolean) => {
    if (isExternal) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ListItemText primary={text} />
        </a>
      );
    }

    return (
      <Link to={url.startsWith('/') ? url : `/${url}`}>
        <ListItemText primary={text} />
      </Link>
    );
  };

  return (
    <StyledMenu open={open} underlineWidth={maxTextLength}>
      <List
        sx={{ width: '100%' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        style={{ padding: '10px 0 5px 0' }}
      >
        {menuLists.map((item) => {
          return (
            <div key={item.name[language]} style={{ padding: 0 }}>
              <ListItemButton
                onClick={
                  item.submenu
                    ? () => handleClick(item.name[language])
                    : undefined
                }
                style={{
                  padding: '0 0 0 10px',
                  marginTop: 0,
                  marginBottom: 0,
                  cursor: 'pointer',
                }}
              >
                {/* ✅ Handle main menu links */}
                {item.url ? (
                  renderLink(item.url, item.name[language], item.isExternal)
                ) : (
                  <ListItemText primary={item.name[language]} />
                )}
                {item.submenu ? displayIcon(item.name[language]) : null}
              </ListItemButton>

              {/* ✅ Handle submenu links */}
              {item.submenu &&
                expandedMenus[item.name[language]] &&
                item.submenu.map((submenuItem) => (
                  <Collapse
                    in={expandedMenus[item.name[language]]}
                    timeout="auto"
                    unmountOnExit
                    key={submenuItem.name[language]}
                  >
                    <List
                      component="div"
                      style={{
                        paddingLeft: 20,
                        paddingTop: 4,
                        paddingBottom: 4,
                      }}
                    >
                      <ListItemButton style={{ padding: 0 }}>
                        {submenuItem.isExternal ? (
                          <a
                            href={submenuItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            <ListItemText
                              primary={submenuItem.name[language]}
                              style={{
                                paddingLeft: 20,
                                marginTop: 0,
                                marginBottom: 0,
                                cursor: 'pointer',
                              }}
                            />
                          </a>
                        ) : (
                          <Link to={`${submenuItem.url}`}>
                            <ListItemText
                              primary={submenuItem.name[language]}
                              style={{
                                paddingLeft: 20,
                                marginTop: 0,
                                marginBottom: 0,
                                cursor: 'pointer',
                              }}
                            />
                          </Link>
                        )}
                      </ListItemButton>
                    </List>
                  </Collapse>
                ))}
            </div>
          );
        })}
      </List>
    </StyledMenu>
  );
};
