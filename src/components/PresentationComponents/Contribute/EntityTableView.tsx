import {
  applyUpdate,
  cloneEntity,
  expandMaterialized,
  isMaterializedEntityArray,
  MaterializedEntity,
  EntitySchema,
  getSchema,
  materializeNew,
  areMatch,
  EntityChange,
  EntityUpdate,
  mergePropertyChange,
  OwnedEntityListChange,
  PropertyChange,
  OwnedEntityListProperty,
} from '@dotproductdev/voyages-contribute';
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
import { Typography } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { Add, Delete, Restore } from '@mui/icons-material';
import { EntityForm, EntityFormProps } from './EntityForm';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

export interface EntityTableViewProps {
  property: OwnedEntityListProperty;
  lastChange?: OwnedEntityListChange;
  entity: MaterializedEntity;
}

interface EntityTableRowProps {
  schema: EntitySchema;
  entity: MaterializedEntity;
  parent: MaterializedEntity;
  property: OwnedEntityListProperty;
  lastChange?: OwnedEntityListChange;
}

const createEmptyChange = (property: string): OwnedEntityListChange => ({
  kind: 'ownedList',
  modified: [],
  removed: [],
  property,
});

const EntityTableRow = ({
  schema,
  entity,
  parent,
  property,
  lastChange,
  onChange,
  ...other
}: EntityTableRowProps & EntityFormProps) => {
  const [open, setOpen] = React.useState(false);
  const isDeleted =
    lastChange &&
    lastChange.removed.findIndex((r) => areMatch(r, entity.entityRef)) >= 0;
  const handleDelAction = useCallback(() => {
    if (isDeleted) {
      onChange({
        type: 'update',
        entityRef: parent.entityRef,
        changes: [
          {
            ...lastChange,
            removed: lastChange.removed.filter(
              (r) => !areMatch(r, entity.entityRef),
            ),
          },
        ],
      });
    } else {
      const change: OwnedEntityListChange =
        lastChange ?? createEmptyChange(property.uid);
      onChange({
        type: 'update',
        entityRef: parent.entityRef,
        changes: [
          {
            ...change,
            removed: [...change.removed, entity.entityRef],
          },
        ],
      });
    }
  }, [isDeleted, lastChange, onChange]);
  const handleRowChange = useCallback(
    (c: EntityChange) => {
      const change: OwnedEntityListChange =
        lastChange ?? createEmptyChange(property.uid);
      if (c.type !== 'update') {
        alert('Not supported change in nested table entry!');
        return;
      }
      const prev = change.modified.find((m) =>
        areMatch(m.ownedEntityId, c.entityRef),
      );
      const next = mergePropertyChange(prev, {
        kind: 'owned',
        ownedEntityId: c.entityRef,
        property: property.uid,
        changes: c.changes,
      });
      onChange({
        type: 'update',
        entityRef: parent.entityRef,
        changes: [
          {
            ...change,
            modified: [
              ...change.modified.filter(
                (m) => !areMatch(m.ownedEntityId, c.entityRef),
              ),
              next,
            ],
          },
        ],
      });
    },
    [lastChange, parent, property, onChange],
  );
  const rowPropChanges: PropertyChange[] = useMemo(() => {
    if (!lastChange) {
      return [];
    }
    return lastChange.modified
      .filter((v) => areMatch(v.ownedEntityId, entity.entityRef))
      .flatMap((v) => v.changes);
  }, [entity, lastChange]);
  const rowChanges: EntityUpdate[] = useMemo(
    () =>
      rowPropChanges.length === 0
        ? []
        : [
            {
              type: 'update',
              entityRef: entity.entityRef,
              changes: rowPropChanges,
            },
          ],
    [entity, rowPropChanges],
  );
  const background = isDeleted
    ? 'red'
    : entity.entityRef.type === 'new'
      ? 'green'
      : 'transparent';
  const updatedEntity = useMemo(() => {
    const e = rowPropChanges.length > 0 ? cloneEntity(entity) : entity;
    if (rowPropChanges.length > 0) {
      applyUpdate(e, expandMaterialized(e), rowPropChanges);
    }
    return e;
  }, [entity, rowPropChanges]);
  return (
    <React.Fragment>
      <TableRow
        sx={{
          '& > *': {
            borderBottom: 'unset',
            background,
          },
        }}
      >
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
          {schema.getLabel(updatedEntity.data)}
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" color="error" onClick={handleDelAction}>
            {isDeleted ? <Restore /> : <Delete />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          {open && (
            <Box sx={{ margin: 1 }}>
              <EntityForm
                key={entity.entityRef.id}
                {...other}
                schema={schema}
                entity={entity}
                changes={rowChanges}
                onChange={handleRowChange}
              />
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
