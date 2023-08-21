

import { TableRow, Paper, Slider, Divider, MenuItem, Grid, Button, TextField } from '@mui/material';
import MuiInput from '@mui/material/Input';
import NestedMenuItem from '../components/canscanding/NestedMenuItem';
import { SxProps, InputBase } from '@mui/material';
import NestedMenuColumnItem from '@/components/FunctionComponents/ColumnSelectorTable/NestedMenuColumnItem';
import { styled, alpha } from '@mui/material/styles';


const blue500 = '#42a5f5';
export const MAINBGGREEN = 'rgba(0, 128, 128, 0.5)'
export const bgNavBar = 'rgba(0, 128, 128, 0.5)'
export const WHITE = '#fff'
export const BLACK = '#000'

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 1,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 128, 128, 0.8)',
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
  width: '75%',
  height: '5px',
  '& .MuiSlider-thumb': {
    backgroundColor: blue500,

  },
  '& .MuiSlider-rail': {
    color: blue500,

  }
}));

export const AppNavStyle = {
  backgroundColor: bgNavBar,
  color: 'black'
}

export const StyleMenuItem = styled('div')(({ theme }) => ({
  '& .Mui-selected': {
    backgroundColor: WHITE,
  },
  '&:hover': {
    backgroundColor: 'rgb(25 118 210 / 12%)',
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


export const StyleDialog: SxProps = {
  '& .MuiDialog-container': {
    position: 'relative',
    top: '15%',
    alignItems: 'flex-start',
  }
}
export const StyleDiver = styled(Divider)`
border-width: 0.25px;
border-color: rgb(0 0 0 / 50%);
`;

export const Tag = styled('div')(({ theme }) => ({
  backgroundColor: '#eaeaea',
  borderRadius: theme.shape.borderRadius,
  padding: '5px',
  marginRight: '5px',
  fontSize: 18,
  fontWeight: 600,
}));

export const ButtonNav = styled(Button)`
  && {
    color: black;
    width: 70px;
    margin: 6px 0;
    font-size: 14px;
    font-weight: 600;
    font-family:  'Cormorant Garamond';
    &:hover {
      background-color: #54bfb6;
      color: white
    }
  }
`;


export const DropdownMenuColumnItem = styled(MenuItem)`
  display: flex;
  justify-content: space-between !important;
  & > ul {
    font-size: '12px';
  }
  & > svg {
    margin-left: 32px;
  }
`;
export const DropdownNestedMenuColumnItem = styled(NestedMenuColumnItem)`
  display: flex;
  justify-content: space-between !important;

  & > svg {
    margin-left: 32px;
  }
`;

export const DialogModalStyle = {
  backgroundColor: 'transparent',
};
export const PaperDraggableStyle = {
  maxWidth: 400
}
export const TextFieldSearch = styled(TextField)`
  & label.Mui-focused {
    color: white;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;