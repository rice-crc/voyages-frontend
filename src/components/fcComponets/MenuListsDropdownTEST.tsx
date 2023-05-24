
// import React, { useState } from 'react';
// import { Button, Box, Paper, Typography, Tab, Tabs } from '@mui/material';
// import RangeSlider from '../RangeSlider';
// import { ChildrenNewObjectProp, YoyagaesFilterMenu, filterMenu } from '../../share/InterfaceTypes';
// import { RootState } from '../../redux/store';
// import { useSelector } from 'react-redux';
// import DropdownTEST from './DropdownTEST';


// const MenuListsDropdownTEST: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const menuOptionFlat: YoyagaesFilterMenu = useSelector((state: RootState) => state.optionFlatMenu.value);
//   const [activeTab, setActiveTab] = useState(0);
//   const [rangeValue, setRangeValue] = useState<Record<string, number[]>>({});
//   const [keyValue, setKeyValue] = useState<string>('');
//   const [idMenu, setIdMenu] = useState(0)
//   const childernItemList:ChildrenNewObjectProp[] = [{varName:'', subMenu: null, id: null, flatlabel: null,type: null}]
//   const handleMenuClick = (id:number) => {
//     setIsOpen(true);
//     setIdMenu(id as number)
//   };

//   const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
//     setActiveTab(newValue);
  
//   };

//   const handleMouseLeave = () => {
//     setIsOpen(false);
//   };
    
//   const renderMenuList = (item: filterMenu, index: number) => (
//     <Button 
//     key={`${item.label}-${index}`}
//     style={{ color: '#000', textTransform: 'none' }}
//     onClick={()=>handleMenuClick(index)}>{item.label}</Button>

// )


// menuOptionFlat.forEach((item, index) => {
//   if (item.children.length !== 0) {
//       item.children.forEach((childernItem) => {
//         childernItemList.push({varName: childernItem.var_name, subMenu: childernItem.label, id: index, flatlabel: childernItem.flatlabel , type: childernItem.type})
//       })
//   }
// })

//   return (
//     <Box>
//         {menuOptionFlat.map(renderMenuList)}
//       {isOpen && (
//         <Box
//           position="absolute"
//           onMouseLeave={handleMouseLeave}
//           zIndex={999}
//         >
//          <DropdownTEST  listMenu={childernItemList} activeTab={activeTab} isOpen={isOpen} setRangeValue={setRangeValue} idMenu={idMenu} handleTabChange={handleTabChange}/>
//         </Box>
//       )}
//     </Box>
//   );
// };


import React, { useState } from 'react';
import { Box, Paper, List, ListItem, ListItemText, Typography } from '@mui/material';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

const MenuListsDropdownTEST = () => {
  const menuOptionFlat = useSelector((state: RootState) => state.optionFlatMenu.value);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [indexMenu, setIndexMenu] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState('');

  const handleMenuClick = (menu: number | null) => {
    setSelectedMenu(menu);
    setSelectedItem('');
    setIndexMenu(menu);
  };

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle content change here
  };

  const renderMenuList = (item: any, index: number) => (
    <ListItem button selected={selectedMenu === index} onClick={() => handleMenuClick(index)} key={index}>
      <ListItemText primary={item.label} />
    </ListItem>
  );

  return (
    <Box>
      <Box component="nav" aria-label="menu list" sx={{ display: 'flex', flexDirection: 'row' }}>
        <Paper>
          <List component="nav" aria-label="menu list" sx={{ display: 'flex', flexDirection: 'row' }}>
            {menuOptionFlat.map(renderMenuList)}
          </List>
        </Paper>
      </Box>

      {selectedMenu !== null && (
        <Box p={2} display="flex" flexDirection="column">
          <Typography variant="h6" component="div" mb={2}>
            Selected Menu: {selectedMenu}
          </Typography>

          <Box display="flex">
            <Paper>
              <List component="nav" aria-label="menu items">
                {selectedMenu === indexMenu && (
                  <>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 1'}
                      onClick={() => handleItemClick('Item 1')}
                    >
                      <ListItemText primary="Item 1" />
                    </ListItem>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 2'}
                      onClick={() => handleItemClick('Item 2')}
                    >
                      <ListItemText primary="Item 2" />
                    </ListItem>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 3'}
                      onClick={() => handleItemClick('Item 3')}
                    >
                      <ListItemText primary="Item 3" />
                    </ListItem>
                  </>
                )}
                {selectedMenu === indexMenu && (
                  <>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 4'}
                      onClick={() => handleItemClick('Item 4')}
                    >
                      <ListItemText primary="Item 4" />
                    </ListItem>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 5'}
                      onClick={() => handleItemClick('Item 5')}
                    >
                      <ListItemText primary="Item 5" />
                    </ListItem>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 6'}
                      onClick={() => handleItemClick('Item 6')}
                    >
                      <ListItemText primary="Item 6" />
                    </ListItem>
                  </>
                )}
                {selectedMenu === indexMenu && (
                  <>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 7'}
                      onClick={() => handleItemClick('Item 7')}
                    >
                      <ListItemText primary="Item 7" />
                    </ListItem>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 8'}
                      onClick={() => handleItemClick('Item 8')}
                    >
                      <ListItemText primary="Item 8" />
                    </ListItem>
                    <ListItem
                      button
                      selected={selectedItem === 'Item 9'}
                      onClick={() => handleItemClick('Item 9')}
                    >
                      <ListItemText primary="Item 9" />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>

            {selectedItem && (
              <Box ml={2}>
                <Typography variant="h6" component="div" mb={2}>
                  Selected Item: {selectedItem}
                </Typography>
                <Paper>
                  <Box p={2}>
                    <Typography variant="body1" component="div">
                      Content for {selectedItem}
                    </Typography>
                    <input
                      type="text"
                      value={selectedItem}
                      onChange={handleContentChange}
                      placeholder="Type here..."
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MenuListsDropdownTEST;

