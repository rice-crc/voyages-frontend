import { StyledMenu } from '@/styleMUI/stylesMenu/StyledMenu';
import { useEffect, useState } from 'react';
import '@/style/menu.scss';
import { Link } from 'react-router-dom';
import { List, ListItemText, ListItemButton, Collapse } from '@mui/material';
import {ExpandLess,ExpandMore} from '@mui/icons-material'
import { menuLists } from '@/utils/functions/menuListHome';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

interface MenuDropdownProps {
  open: boolean;
}

interface SubmenuState {
  [menuName: string]: boolean;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ open }) => {
  const [maxTextLength, setMaxTextLength] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({});
  const { languageValue: Lang } = useSelector((state: RootState) => state.getLanguages);
  useEffect(() => {
    const maxLength = Math.max(...menuLists.map((list) => list.name[Lang].length));

    setMaxTextLength(maxLength * 5);
  }, [menuLists]);

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

            <div key={item.name[Lang]} style={{ padding: 0 }}>
              <ListItemButton
                onClick={
                  item.submenu ? () => handleClick(item.name[Lang]) : undefined
                }
                style={{
                  padding: '0 0 0 10px',
                  marginTop: 0,
                  marginBottom: 0,
                  cursor: 'pointer',
                }}
              >
                <Link to={`/${item.url}`}>
                  <ListItemText primary={item.name[Lang]} />
                </Link>
                {item.submenu ? displayIcon(item.name[Lang]) : null}
              </ListItemButton>
              {item.submenu &&
                expandedMenus[item.name[Lang]] &&
                item.submenu.map((submenuItem) => (
                  <Collapse
                    in={expandedMenus[item.name[Lang]]}
                    timeout="auto"
                    unmountOnExit
                    key={submenuItem.name[Lang]}
                  >
                    <List component="div" style={{ paddingLeft: 20 }}>
                      <ListItemButton style={{ padding: 0 }}>
                        <Link to={`${submenuItem.url}`}>
                          {' '}
                          <ListItemText
                            primary={submenuItem.name[Lang]}
                            style={{
                              paddingLeft: 20,
                              marginTop: 0,
                              marginBottom: 0,
                              cursor: 'pointer',
                            }}
                          />
                        </Link>
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
