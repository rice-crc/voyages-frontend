import styled from 'styled-components';
import { useState } from 'react'; // Import useState hook

interface StyledMenuProps {
  open: boolean;
  underlineWidth: number;
  children?: React.ReactNode;
}

export const StyledMenu = styled.nav<StyledMenuProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  text-align: left;
  padding: 3rem 2rem 1rem 2rem;
  position: absolute;
  top: 1px;
  left: 0;
  z-index: 2;
  transition: transform 0.3s ease-in-out;
  width: 200px;
  @media (max-width: 576px) {
    width: 80%;
  }

  /* Main menu item styles */
  a {
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    text-decoration: none;
    position: relative;
    border-bottom: 2.5px solid transparent;
    transition: border-bottom 0.3s ease-in-out;

    &:hover {
      color: #008ca8;
      font-size: 14px;
      border-bottom: 2.5px solid #008ca8;
      width: fit-content;
    }

    &::before {
      content: '';
      position: absolute;
      height: px;
      background: #008ca8;
      bottom: 0;
      left: 0;
      transform: scaleX(0.5);
      transform-origin: bottom;
      transition: transform 0.3s ease-in-out;
      width: ${(props) => props.underlineWidth + 'px'};
    }

    &:hover::before {
      transform: scaleX(1);
    }
  }
  .submenu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    padding: 10px;
    border: 1px solid #ccc;
    z-index: 10;
  }

  .submenu.active {
    display: block;
  }
`;
