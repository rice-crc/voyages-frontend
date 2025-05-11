import React from 'react';
import {
  EntityChange,
  TableChange,
  MaterializedEntity,
  TableProperty,
} from '@dotproductdev/voyages-contribute';
import '@/style/numberTable.scss';
import { StyleDialog } from '@/styleMUI';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { PaperDraggableNumbersTable } from '@/components/SelectorComponents/Cascading/PaperDraggable';
import NumbersTableComponent from './NumbersTableComponent';

interface NumbersTableDialogProps {
  property: TableProperty;
  entity: MaterializedEntity;
  lastChange?: TableChange;
  onChange: (change: EntityChange) => void;
  onClose: (change: boolean) => void;
  openDialog: boolean
}

const NumbersTableDialog: React.FC<NumbersTableDialogProps> = ({ property, entity, lastChange, onChange, onClose, openDialog, ...other }) => {

  return (
    <Dialog
      open={openDialog}
      onClose={onClose}
      disableScrollLock={false}
      sx={StyleDialog}
      fullWidth
      maxWidth="sm"
      PaperComponent={PaperDraggableNumbersTable}
      aria-labelledby="draggable-dialog-title-contribute"
    >
      <DialogTitle
        sx={{
          cursor: 'move',
          position: 'relative',
          textAlign: 'center',
          fontWeight: 600,
          bgcolor: 'rgb(55, 148, 141)',
          color: '#fff',
          py: "20px",
        }}
      >
        <div style={{ fontSize: '1rem' }}>
          Table of  {property.section}
        </div>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => onClose(false)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ padding: '30px 15px 15px 15px' }}>
        <NumbersTableComponent
          property={property}
          entity={entity}
          lastChange={lastChange}
          onChange={onChange}
          {...other}
        />
      </DialogContent>
    </Dialog>
  )
};

export default NumbersTableDialog;
