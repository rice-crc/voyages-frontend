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
  TableRow,
} from '@mui/material';
import { Collapse, Row, Typography } from 'antd';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import { EntitySchema, getSchema } from '@/models/entities';
import { EntityForm, EntityFormProps } from './EntityForm';
import { DeleteIcon } from 'lucide-react';

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
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {schema.getLabel(entity.data)}
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" color="error" onClick={() => alert("Not implemented yet")}>
            <DeleteIcon />
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
                <Typography.Title level={5}>{property.label}</Typography.Title>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" color="success"  onClick={() => alert("Not implemented yet")}>
                  <AddIcon />
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
