import Tooltip from '@mui/material/Tooltip';
import { ReactNode } from 'react';

interface PopoverWrapperProps {
  children: ReactNode;
  popoverContents: ReactNode;
  padding?: number;
}

const PopoverWrapper = ({
  children,
  popoverContents,
  padding,
}: PopoverWrapperProps) => {
  return (
    <Tooltip
      title={
        <div style={{ padding: padding ?? 2, whiteSpace: 'pre-line', maxWidth: 1000 }}>
          {popoverContents}
        </div>
      }
      placement="top"
      arrow
      enterDelay={200}
      leaveDelay={200}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: '#fff',
            color: '#000',
            boxShadow: '1px 2px 8px rgba(0, 0, 0, 0.6)',
            fontSize: '0.85rem',
            maxWidth: 800,
            py: 0,
            px: 2,
          },
        },
        arrow: {
          sx: {
            color: '#fff',
          },
        },
      }}
    >
      <span style={{ display: 'inline-block' }}>{children}</span>
    </Tooltip>
  );
};

export default PopoverWrapper;
