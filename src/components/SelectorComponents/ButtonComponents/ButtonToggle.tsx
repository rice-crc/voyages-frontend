import { useState } from 'react';
import { Toolbar , MenuItem, Button} from '@mui/material';
import { MenuButton } from '@/styleMUI';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
interface ButtonToggleProps {
  handleDrawerOpen: () => void;
}
const ButtonToggle = ({handleDrawerOpen}: ButtonToggleProps) => {


  return (
    <Toolbar>
        <MenuButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuIcon />
        </MenuButton>
    </Toolbar>
  );
}

export default ButtonToggle