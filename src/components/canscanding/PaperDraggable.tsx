import { Paper } from "@mui/material";
import { useRef } from "react";
import Draggable from "react-draggable";
import { PaperProps } from '@mui/material/Paper';


export function PaperDraggable(props: PaperProps) {
    const paperRef = useRef<HTMLDivElement>(null);
  
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
        nodeRef={paperRef}
      >
        <Paper {...props} ref={paperRef}  />
      </Draggable>
    );
  }
  