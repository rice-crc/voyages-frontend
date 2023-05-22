
import { styled } from "@mui/material/styles";

import { TableRow, Paper, Slider, Theme } from "@mui/material";
import MuiInput from "@mui/material/Input";
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
