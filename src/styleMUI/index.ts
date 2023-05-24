
import { styled } from "@mui/material/styles";
import { TableRow, Paper, Slider, Theme, MenuItem, Grid } from "@mui/material";
import MuiInput from "@mui/material/Input";
import NestedMenuItem from "../components/canscanding/NestedMenuItem";
import { MenuListDropdown } from "../components/canscanding/MenuListDropdown";


const blue500 = "#42a5f5";
export const bgNavBar = "#85d4cbde"
export const WHITE = "#fff"

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 1,
  },
  "&:hover": {
    backgroundColor: "#85d4cb",
  },
}));

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const Input = styled(MuiInput)`
  width: 80px;
`;


export const CustomSlider = styled(Slider)(() => ({
  color: blue500,
  width: "70%",
  height: "5px",
  "& .MuiSlider-thumb": {
    backgroundColor: blue500,

  },
  "& .MuiSlider-rail": {
    color: blue500,

  }
}));

export const AppNavStyle = {
  backgroundColor: bgNavBar,
  color: 'black'
}

export const StyleMenuItem = styled('div')(({ theme }) => ({
  "& .Mui-selected": {
    backgroundColor: WHITE,
  },
  "&:hover": {
    backgroundColor: "rgb(25 118 210 / 12%)",
  },
}));

export const DropdownMenuItem = styled(MenuItem)`
  display: flex;
  justify-content: space-between !important;

  & > svg {
    margin-left: 32px;
  }
`;

export const DropdownNestedMenuItem = styled(NestedMenuItem)`
  display: flex;
  justify-content: space-between !important;

  & > svg {
    margin-left: 32px;
  }
`;

export const MenuListDropdownStyle = styled('div')`
  & > div {
    display: inline-grid;
    min-height: auto;
    & > button {
        text-align: left;
    }
  }
`;

export const GridStyleComponent = styled(Grid)(() => ({
  backgroundColor: WHITE,
  padding: 15
}));



export const useStyles = styled('div')((theme) => ({
  menuButton: {
    marginRight: 8,
  },
  title: {
    flexGrow: 1,
  },
  dropdownContainer: {
    padding: 8,
  },
  mediaObject: {
    width: '100px',
    height: '100px',
  },
  rangeSlider: {
    width: '200px',
    marginLeft: '20px',
  },
}));

