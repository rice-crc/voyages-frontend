import { OwnedEntityListChange } from '@/models/changeSets';
import {
  isMaterializedEntityArray,
  MaterializedEntity,
} from '@/models/materialization';
import { OwnedEntityListProperty } from '@/models/properties';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,Typography
} from '@mui/material';
import React from 'react';
import { KeyboardArrowDown, KeyboardArrowUp, Add, Delete } from '@mui/icons-material';
import { EntitySchema, getSchema } from '@/models/entities';
import { EntityForm, EntityFormProps } from './EntityForm';

export interface EntityTableViewProps {
  property: OwnedEntityListProperty;
  lastChange?: OwnedEntityListChange;
  entity: MaterializedEntity;
}

interface EntityTableRowProps {
  schema: EntitySchema;
  entity: MaterializedEntity;
}

const EntityTableRow = ({
  schema,
  entity,
  ...other
}: EntityTableRowProps & EntityFormProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {schema.contributionMode !== 'ReadOnly' && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {schema.getLabel(entity.data)}
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" color="error" onClick={() => alert("Not implemented yet")}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          {open && (
            <Box sx={{ margin: 1 }}>
              <EntityForm {...other} schema={schema} entity={entity} />
            </Box>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const EntityTableView = ({
  property,
  entity,
  lastChange,
  ...other
}: EntityTableViewProps & EntityFormProps) => {
  const { label, linkedEntitySchema } = property;
  const children = entity.data[label];
  if (!isMaterializedEntityArray(children)) {
    return (
      <span>
        BUG: The entity data does not match the expectation of being an array of
        materialized entities (children)
      </span>
    );
  }
  const childSchema = getSchema(linkedEntitySchema);
  return (
    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <Typography variant="h6">{property.label}</Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" color="success"  onClick={() => alert("Not implemented yet")}>
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((c, i) => (
              <EntityTableRow
                key={i}
                {...other}
                entity={c}
                schema={childSchema}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
