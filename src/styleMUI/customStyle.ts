import { CSSProperties } from "react";
import { styled } from '@mui/material/styles';

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};
export const styleCard: CSSProperties = {
  backgroundColor: '#e5e5e5',
  borderRadius: '6px',
  padding: '4px 8px',
  height: '20px',
  // whiteSpace: 'nowrap',
  // overflowWrap: 'break-word',
  textAlign: 'left',
  lineHeight: '25px',
  fontSize: '13px',
  cursor: 'pointer',
  wordWrap: 'break-word'
};
export const contentStyle: React.CSSProperties = {
  height: '200px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
  width: '30%',
  margin: '2%'
};


export const PopupSaveSearchBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
    };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`,
);