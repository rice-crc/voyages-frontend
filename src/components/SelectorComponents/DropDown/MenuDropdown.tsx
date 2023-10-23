import { StyledMenu } from '@/styleMUI/stylesMenu/StyledMenu';
import { useEffect, useState } from 'react';

interface MenuDropdownProps {
  open: boolean;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ open }) => {
  const [maxTextLength, setMaxTextLength] = useState(0);

  const menuLists = ['Estimates', 'Contribute', 'TIMELAPSE', 'LESSON PLANS', 'INTRODUCTORY MAPS', '3D VIDEOS', 'ABOUT']
  useEffect(() => {

    const maxLength = Math.max(...menuLists.map((list) => list.length));
    setMaxTextLength(maxLength * 10);
  }, [menuLists]);

  return (
    <StyledMenu open={open} underlineWidth={maxTextLength}>
      {menuLists.map((list) => (
        <a href="/" key={list} >{list.toUpperCase()}</a>
      ))}

    </StyledMenu>
  );
};
