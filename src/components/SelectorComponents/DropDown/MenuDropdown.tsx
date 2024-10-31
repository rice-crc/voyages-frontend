import {StyledMenu} from '@/styleMUI/stylesMenu/StyledMenu';
import {useEffect, useState} from 'react';
import '@/style/menu.scss';
import {Link} from 'react-router-dom';
import {List, ListItemText, ListItemButton, Collapse} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {menuLists} from '@/utils/functions/menuListHome';

interface MenuDropdownProps {
  open: boolean;
}

interface SubmenuState {
  [menuName: string]: boolean;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({open}) => {
  const [maxTextLength, setMaxTextLength] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({});

  useEffect(() => {
    const maxLength = Math.max(...menuLists.map((list) => list.name.length));

    setMaxTextLength(maxLength * 5);
  }, [menuLists]);

  const handleClick = (menuName: string) => {
    const isExpanded = expandedMenus[menuName];
    setExpandedMenus(prevState => ({
      ...prevState,
      [menuName]: !isExpanded,
    }));
  };

  const displayIcon = (menuName: string) => {
    return expandedMenus[menuName] ? <span className='menu_icon'><ExpandLess />  </span> : <span className='menu_icon'><ExpandMore /></span>;
  };

  return (
    <StyledMenu open={open} underlineWidth={maxTextLength}>
      <List
        sx={{width: '100%'}}
        component="nav"
        aria-labelledby="nested-list-subheader"
        style={{padding: '10px 0 5px 0'}}
      >
        {menuLists.map((item) => {
          console.log({item});
          return (
            <div key={item.name} style={{padding: 0}}>
              <ListItemButton onClick={item.submenu ? () => handleClick(item.name) : undefined} style={{padding: '0 0 0 10px', marginTop: 0, marginBottom: 0, cursor: 'pointer'}}>
                <Link to={`/${item.url}`}><ListItemText primary={item.name} /></Link>
                {item.submenu ? displayIcon(item.name) : null}
              </ListItemButton>
              {item.submenu && expandedMenus[item.name] &&
                item.submenu.map((submenuItem) => (
                  <Collapse in={expandedMenus[item.name]} timeout="auto" unmountOnExit key={submenuItem.name}>
                    <List component="div" style={{paddingLeft: 20}}>
                      <ListItemButton style={{padding: 0}}>
                        <Link to={`${submenuItem.url}`}> <ListItemText primary={submenuItem.name} style={{paddingLeft: 20, marginTop: 0, marginBottom: 0, cursor: 'pointer'}} /></Link>
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
