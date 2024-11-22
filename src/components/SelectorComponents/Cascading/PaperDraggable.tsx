import {Paper} from '@mui/material';
import {useRef} from 'react';
import Draggable from 'react-draggable';
import {PaperProps} from '@mui/material/Paper';
import {PaperDraggableStyle, PaperDraggableTimeLapseStyle} from '@/styleMUI';

export function PaperDraggable(props: PaperProps) {
  const paperRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper {...props} ref={paperRef} style={{...PaperDraggableStyle}} />
    </Draggable>
  );
}

export function PaperDraggableTimeLapse(props: PaperProps) {
  const paperRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable
      handle="#draggable-dialog-title-timelapse"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper {...props} ref={paperRef} style={{...PaperDraggableTimeLapseStyle}} />
    </Draggable>
  );
}
