/* eslint-disable prettier/prettier */
import styled from 'styled-components';
interface StyledBurgerProps {
  open: boolean;
}

export const StyledBurger = styled.button<StyledBurgerProps>`
  position: absolute;
  top: 1%;
  left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  &:focus {
    outline: none;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: ${({ open }: StyledBurgerProps) =>
    open ? '#0D0C1D' : '#000000'};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }: StyledBurgerProps) =>
    open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    :nth-child(2) {
      opacity: ${({ open }: StyledBurgerProps) => (open ? '0' : '1')};
      transform: ${({ open }: StyledBurgerProps) =>
    open ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${({ open }: StyledBurgerProps) =>
    open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;
