import styled from "styled-components";
interface StyledMenuProps {
  open: boolean;
  underlineWidth: number;
}

export const StyledMenu = styled.nav<StyledMenuProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #ffffff;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
    text-align: left;
    padding: 3rem 2rem 1rem 2rem;
    position: absolute;
    top: 1px;
    left: 0;
    z-index:2;
    transition: transform 0.3s ease-in-out;
    width: 170px;
    @media (max-width: 576px) {
      width: 80%;
    }
  
    a {
      font-size: 14px;
      padding: 5px 0;
      font-weight: bold;
      color: #000000;
      text-decoration: none;
      position: relative;
      border-bottom: 2px solid transparent;
      transition: border-bottom 0.3s ease-in-out;

      &::before {
        content: "";
        position: absolute;
        height: 2px;
        background: #008ca8;
        bottom: 0;
        left: 0;
        transform: scaleX(0);
        transform-origin: bottom;
        transition: transform 0.3s ease-in-out;
        width: ${(props) => props.underlineWidth + "px"};
      }
      @media (max-width: 576px) {
        font-size: 1rem;
        text-align: left;
        adding-left: 2rem;
      }
      &:hover {
        color: #008ca8;
        font-size: 16x;
        border-bottom: 2px solid #008ca8;
        &::before {
          transform: scaleX(-1);
        }
      }
    }
  `;
