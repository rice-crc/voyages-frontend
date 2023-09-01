import { Paper } from '@mui/material';
import { useRef } from 'react';
import Draggable from 'react-draggable';
import { PaperProps } from '@mui/material/Paper';
import { PaperDraggableStyle } from '@/styleMUI';
import { TYPES } from '@/share/InterfaceTypes';

export function PaperDraggable(props: PaperProps & { type: string }) {
  const paperRef = useRef<HTMLDivElement>(null);
  const maxWidth = props.type === TYPES.GeoTreeSelect ? 500 : 400;
  const height = props.type === TYPES.GeoTreeSelect ? '50%' : 'auto';

  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper
        {...props}
        ref={paperRef}
        style={{ ...PaperDraggableStyle, maxWidth, height }}
      />
    </Draggable>
  );
}
