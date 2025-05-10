
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
    TableCell,
    TableRow,
  } from '@mui/material';
  import React, { useCallback, useMemo } from 'react';
  import { Add, Delete, Restore } from '@mui/icons-material';
  import { EntityForm, EntityFormProps } from './EntityForm';
  import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { createEmptyChange } from './EntityTableView';
  
  interface EntityTableRowProps {
    schema: EntitySchema;
    entity: MaterializedEntity;
    parent: MaterializedEntity;
    property: OwnedEntityListProperty;
    lastChange?: OwnedEntityListChange;
  }

export const EntityTableRow = ({
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
  