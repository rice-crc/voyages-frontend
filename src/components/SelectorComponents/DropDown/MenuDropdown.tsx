import { ASSESSMENT, CONTRIBUTE, ESTIMATES, INTRODUCTORYMAPS, LESSONPLANS, SUMMARYSTATISTICS, TIMELAPSEPAGE } from '@/share/CONST_DATA';
import { StyledMenu } from '@/styleMUI/stylesMenu/StyledMenu';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface MenuDropdownProps {
  open: boolean;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ open }) => {
  const [maxTextLength, setMaxTextLength] = useState(0);
  const menuLists = [
    { name: 'Estimates', url: `${ASSESSMENT}/${ESTIMATES}/` },
    { name: 'Contribute', url: `${ASSESSMENT}/${CONTRIBUTE}/` },
    { name: 'LESSON PLANS', url: `${ASSESSMENT}/${LESSONPLANS}/` },
    { name: 'INTRODUCTORY MAPS', url: `${ASSESSMENT}/${INTRODUCTORYMAPS}/` },
    // { name: 'TIMELAPSE', url: `${TIMELAPSEPAGE}/` },
    { name: 'TIMELAPSE', url: `https://www.slavevoyages.org/voyage/database#timelapse` },
    { name: 'Summary', url: `${SUMMARYSTATISTICS}` },
    { name: '3D VIDEOS', url: `https://www.slavevoyages.org/voyage/ship#3dmodel/0/en/` },
    { name: 'ABOUT', url: 'https://www.slavevoyages.org/about/about#' },
  ]


  useEffect(() => {
    const maxLength = Math.max(...menuLists.map((list) => list.name.length));

    setMaxTextLength(maxLength * 10);

  }, [menuLists]);

  return (
    <StyledMenu open={open} underlineWidth={maxTextLength}>
      {menuLists.map((list) => (
        list.url.startsWith('http') ? (
          <a href={list.url} key={list.name} target="_blank" rel="noopener noreferrer">
            {list.name.toUpperCase()}
          </a>
        ) : (
          <Link to={`/${list.url}`} key={list.name}>
            {list.name.toUpperCase()}
          </Link>
        )
      ))}
    </StyledMenu>
  );
};