import { ManyToManyEntityListChange } from '@/models/changeSets';
import {
    isMaterializedEntity,
  isMaterializedEntityArray,
  MaterializedEntity,
} from '@/models/materialization';
import {
  ManyToManyEntityListProperty,
  ManyToManyEntityRelation,
} from '@/models/properties';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Select, Typography } from 'antd';
import React from 'react';
import { Add, Delete } from '@mui/icons-material';
import { EntitySchema, getSchema } from '@/models/entities';
import { EntityForm, EntityFormProps } from './EntityForm';
import { EntityPropertyComponent } from './EntityPropertyComponent';

export interface EntityManyToManyTableProps {
  property: ManyToManyEntityListProperty;
  lastChange?: ManyToManyEntityListChange;
  entity: MaterializedEntity;
}

interface EntityTableRowProps {
  schema: EntitySchema;
  entity: MaterializedEntity;
  property: ManyToManyEntityListProperty;
}

const EntityManyToManyTableRow = ({
  schema,
  entity,
  property,
  ...other
}: EntityTableRowProps & EntityFormProps) => {
  const mockOptions = [1, 2, 3, 4, 5, 6].map((_, i) => ({
    label: `Mocked ${property.linkedEntitySchema} with id ${i}`,
    value: i,
  }));
  const rightSide = entity.data[property.connection.rightSideBackingField]
  if (rightSide !== undefined && !isMaterializedEntity(rightSide)){
    return <span>BUG: unexpected value for right side of M2M connection</span>
  }
  mockOptions.push({
    label: getSchema(property.linkedEntitySchema).getLabel(rightSide?.data ?? {}),
    value: rightSide.entityRef.id as number
  })
  // TODO: handle changes.
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <Select
            value={rightSide.entityRef.id}
            placeholder={`Please select ${property.label}`}
            style={{ width: 'calc(100% - 20px)' }}
            options={mockOptions}
            //onChange={handleChange}
          />
        </TableCell>
        {schema.properties.map((p) => (
          <TableCell>
            <EntityPropertyComponent
              {...other}
              entity={entity}
              property={p}
              schema={schema}
            />
          </TableCell>
        ))}
        <TableCell align="right">
          <IconButton
            size="small"
            color="error"
            onClick={() => alert('Not implemented yet')}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const EntityManyToManyTable = ({
  property,
  entity,
  lastChange,
  ...other
}: EntityManyToManyTableProps & EntityFormProps) => {
  const { label, linkedEntitySchema, connection } = property;
  const children = entity.data[label];
  if (!isMaterializedEntityArray(children)) {
    return (
      <span>
        BUG: The entity data does not match the expectation of being an array of
        materialized entities (children)
      </span>
    );
  }
  const connSchema = getSchema(connection.connectionEntity);
  return (
    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography.Title level={5}>{property.label}</Typography.Title>
              </TableCell>
              {connSchema.properties.map((p) => (
                <TableCell component="th" scope="row" key={p.uid}>
                  {p.label}
                </TableCell>
              ))}
              <TableCell align="right">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => alert('Not implemented yet')}
                >
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((c, i) => (
              <EntityManyToManyTableRow
                key={`row-${i}`}
                {...other}
                entity={c}
                schema={connSchema}
                property={property}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
