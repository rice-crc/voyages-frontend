import {
  applyUpdate,
  isMaterializedEntityArray,
  MaterializedEntity,
  getSchema,
  materializeNew,
  areMatch,
  OwnedEntityListChange,
  OwnedEntityListProperty,
} from '@dotproductdev/voyages-contribute';
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
import { Typography } from 'antd';
import  { useCallback, useMemo } from 'react';
import { Add } from '@mui/icons-material';
import {  EntityFormProps } from './EntityForm';
import { EntityTableRow } from './EntityTableRow';

export interface EntityTableViewProps {
  property: OwnedEntityListProperty;
  lastChange?: OwnedEntityListChange;
  entity: MaterializedEntity;
}

export const createEmptyChange = (property: string): OwnedEntityListChange => ({
  kind: 'ownedList',
  modified: [],
  removed: [],
  property,
});

export const EntityTableView = ({
  property,
  entity,
  lastChange,
  ...other
}: EntityTableViewProps & EntityFormProps) => {
  const { label, linkedEntitySchema } = property;
  const fieldValue = entity.data[label];
  if (!isMaterializedEntityArray(fieldValue)) {
    return (
      <span>
        BUG: The entity data does not match the expectation of being an array of
        materialized entities (children)
      </span>
    );
  }
  const childSchema = getSchema(linkedEntitySchema);
  const children = useMemo(() => {
    const res: MaterializedEntity[] = [...fieldValue];
    if (lastChange) {
      const added = lastChange.modified.filter(
        (m) =>
          m.ownedEntityId.type === 'new' &&
          !res.find((e) => areMatch(m.ownedEntityId, e.entityRef)),
      );
      for (const m of added) {
        const item = materializeNew(childSchema, m.ownedEntityId.id);
        applyUpdate(item, {}, m.changes);
        res.push(item);
      }
    }
    // Make sure that the order in which the rows appear is consistent.
    res.sort((x, y) => {
      const a = x.entityRef.id;
      const b = y.entityRef.id;
      if (typeof a === 'number') {
        if (typeof b === 'number') {
          return a - b;
        }
        return -1;
      }
      if (typeof b === 'number') {
        return 1;
      }
      return a.localeCompare(b);
    });
    return res;
  }, [entity, lastChange, childSchema, fieldValue]);
  const onChange = other.onChange;
  const handleAdd = useCallback(() => {
    const change = lastChange ?? createEmptyChange(property.uid);
    const childProp = childSchema.properties.find(
      (p) => p.label === property.childBackingProp,
    );
    if (childProp === undefined) {
      throw new Error(
        `Invalid schema: the child property "${property.childBackingProp}" was not found in ${linkedEntitySchema}`,
      );
    }
    onChange({
      type: 'update',
      entityRef: entity.entityRef,
      changes: [
        {
          ...change,
          modified: [
            ...change.modified,
            {
              kind: 'owned',
              ownedEntityId: {
                type: 'new',
                id: `${new Date().getTime()}${crypto.randomUUID()}`,
                schema: linkedEntitySchema,
              },
              property: property.uid,
              changes: [
                {
                  kind: 'direct',
                  property: childProp.uid,
                  changed: entity.entityRef.id,
                },
              ],
            },
          ],
        },
      ],
    });
  }, [entity, lastChange, property, linkedEntitySchema, onChange]);

  return (
    <div style={{ marginTop: '10px', marginBottom: '10px'}}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow >
              <TableCell />
              <TableCell>
                <Typography.Title level={5}  style={{ color: 'rgb(55, 148, 141)' }}>{property.label}</Typography.Title>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" color="success" onClick={handleAdd}>
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((c, i) => (
              <EntityTableRow
                key={c.entityRef.id}
                {...other}
                entity={c}
                schema={childSchema}
                parent={entity}
                property={property}
                lastChange={lastChange}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
