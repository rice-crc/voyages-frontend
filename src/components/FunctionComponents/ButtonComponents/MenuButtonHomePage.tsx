import React, { useState, useRef, useEffect } from 'react';
import { BurgerMenu } from './BurgerMenu';
import { MenuDropdown } from '../DropDown/MenuDropdown';

const MenuButtonHomePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!node.current || node.current.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, []);

  return (
    <div>
      <div ref={node}>
        <BurgerMenu open={open} setOpen={setOpen} />
        <MenuDropdown open={open} />
      </div>
    </div>
  );
};
export default MenuButtonHomePage;
