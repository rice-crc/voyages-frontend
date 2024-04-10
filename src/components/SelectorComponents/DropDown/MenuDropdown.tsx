import { ASSESSMENT, BLOGPAGE, CONTRIBUTE, DOCUMENTPAGE, ESTIMATES, INTRAAMERICANPAGE, TRANSATLANTICTIMELAPSE } from '@/share/CONST_DATA';
import { StyledMenu } from '@/styleMUI/stylesMenu/StyledMenu';
import { useEffect, useState } from 'react';
import '@/style/menu.scss'
import { Link } from 'react-router-dom';
import { List, ListItemText, ListItemButton, Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { time } from 'console';
import SubMenu from 'antd/es/menu/SubMenu';

interface MenuDropdownProps {
  open: boolean;
}


export const MenuDropdown: React.FC<MenuDropdownProps> = ({ open }) => {
  const [maxTextLength, setMaxTextLength] = useState(0);
  const [openSubMenu, setOpenSubMenu] = useState(true);
  const menuLists = [
    { name: 'About', url: `${BLOGPAGE}/tag/about` },
    { name: 'Intro Maps', url: `${BLOGPAGE}/introductory-maps-to-the-transatlantic-slave-trade/148` },
    {
      name: 'Essays', url: `${BLOGPAGE}/tag/essays`,
      submenu: [
        { name: 'Trans-Atlantic', url: `${BLOGPAGE}/tag/essays-trans-atlantic` },
        { name: 'Intra-American ', url: `${BLOGPAGE}/tag/essays-intra-american` },
        { name: 'Texas Bound', url: `${BLOGPAGE}/tag/texas-bound` }
      ],
    },
    { name: 'Estimates', url: `${ASSESSMENT}/${ESTIMATES}/` },
    {
      name: 'Timelapse', url: `${TRANSATLANTICTIMELAPSE}#timelapse`,
      submenu: [
        { name: 'Trans-Atlantic', url: `${TRANSATLANTICTIMELAPSE}#timelapse` },
        { name: 'Intra-American', url: `${INTRAAMERICANPAGE}#timelapse` },
      ],
    },
    { name: '3D Videos', url: `${BLOGPAGE}/3d-videos-slaving-vessels` },
    { name: 'Lesson Plans', url: `${BLOGPAGE}/tag/lesson-plan` },
    { name: 'Documents', url: `${DOCUMENTPAGE}` },
    { name: 'Methodology', url: `${BLOGPAGE}/tag/methodology` },
    { name: 'Resources', url: `${BLOGPAGE}/tag/resources` },
    { name: 'Downloads', url: `${BLOGPAGE}/tag/downloads` },
    { name: 'Contribute', url: `${CONTRIBUTE}` },
  ]
  useEffect(() => {
    const maxLength = Math.max(...menuLists.map((list) => list.name.length));


    setMaxTextLength(maxLength * 5);

  }, [menuLists]);
  const handleClick = () => {

    setOpenSubMenu(!openSubMenu);
  };
  const displayIcon = openSubMenu ? <span className='menu_icon'><ExpandLess />  </span> : <span className='menu_icon'><ExpandMore /></span>
  return (
    <StyledMenu open={open} underlineWidth={maxTextLength}>
      <List
        sx={{ width: '100%' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        style={{ padding: 0 }}
      >
        {menuLists.map((item) => {
          return (
            <div key={item.name} style={{ padding: 0 }}>
              <ListItemButton onClick={item.submenu ? handleClick : undefined} style={{ padding: '0 0 0 10px', marginTop: 0, marginBottom: 0, cursor: 'pointer' }}>
                <Link to={`/${item.url}`}><ListItemText primary={item.name} /></Link>
                {item.submenu ? displayIcon : null}
              </ListItemButton>
              {item.submenu
                ? item.submenu.map((sumMenu) => (
                  <Collapse in={!openSubMenu} timeout="auto" unmountOnExit key={sumMenu.name}>
                    <List component="div" style={{ paddingLeft: 20 }}>
                      <ListItemButton style={{ padding: 0 }}>
                        <Link to={`${sumMenu.url}`}> <ListItemText primary={sumMenu.name} style={{ paddingLeft: 20, marginTop: 0, marginBottom: 0, cursor: 'pointer' }} /></Link>
                      </ListItemButton>
                    </List>
                  </Collapse>
                ))
                : null}
            </div>
          );
        })}
      </List>
    </StyledMenu>
  );
};
