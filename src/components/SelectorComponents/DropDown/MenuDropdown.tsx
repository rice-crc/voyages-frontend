import { StyledMenu } from '@/styleMUI/stylesMenu/StyledMenu';

interface MenuDropdownProps {
  open: boolean;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ open }) => {
  return (
    <StyledMenu open={open}>
      <a href="/">TIMELAPSE</a>
      <a href="/">LESSON PLANS</a>
      <a href="/">INTRODUCTORY MAPS</a>
      <a href="/">3D VIDEOS</a>
      <a href="/">ABOUT</a>
    </StyledMenu>
  );
};
