import styled from "styled-components";
interface StyledMenuProps {
    open: boolean;
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
    transition: transform 0.3s ease-in-out;
    width: 170px;
    @media (max-width: 576px) {
      width: 100%;
    }
  
    a {
      font-size: 16px;
      padding: 5px 0;
      font-weight: bold;
      color: #000000;
      text-decoration: none;
      transition: color 0.3s linear;
      @media (max-width: 576px) {
        font-size: 1.5rem;
        text-align: center;
      }
  
      &:hover {
        color: #343078;
      }
    }
  `;
