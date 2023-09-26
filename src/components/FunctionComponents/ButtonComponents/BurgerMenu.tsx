import { StyledBurger } from '../../../styleMUI/stylesMenu/StyledBurger';

interface BurgerMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ open, setOpen }) => {
  return (
    <StyledBurger open={open} onClick={() => setOpen(!open)}>
      <div />
      <div />
      <div />
    </StyledBurger>
  );
};
