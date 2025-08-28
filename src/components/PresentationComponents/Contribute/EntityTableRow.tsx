import { useCallback, useMemo, useState } from 'react';

import {
  applyUpdate,
  cloneEntity,
  MaterializedEntity,
  EntitySchema,
  areMatch,
  EntityChange,
  EntityUpdate,
  mergePropertyChange,
  OwnedEntityListChange,
  PropertyChange,
  OwnedEntityListProperty,
  materializeNew,
  getSchema,
  OwnedEntityChange,
} from '@dotproductdev/voyages-contribute';
import {
  Delete,
  Restore,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { Box, IconButton, TableCell, TableRow, Collapse } from '@mui/material';

import { useDebounce } from '@/hooks/useDebounce';

import { EntityForm, EntityFormProps } from './EntityForm';
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
  const [open, setOpen] = useState(false);

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
  }, [
    isDeleted,
    lastChange,
    onChange,
    entity.entityRef,
    parent.entityRef,
    property.uid,
  ]);

  const handleRowChange = useCallback(
    (c: EntityChange) => {
      const change: OwnedEntityListChange =
        lastChange ?? createEmptyChange(property.uid);
      if (c.type !== 'update') {
        alert('Not supported change in nested table entry!');
        return;
      }
      if (!areMatch(c.entityRef, entity.entityRef)) {
        alert('Unexpected entityRef in nested table entry!');
        return;
      }
      const prev = change.modified.find((m) =>
        areMatch(m.ownedEntity.entityRef, c.entityRef),
      );
      const next = mergePropertyChange(prev as OwnedEntityChange, {
        kind: 'owned',
        ownedEntity: prev?.ownedEntity ?? entity,
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
                (m) => !areMatch(m.ownedEntity.entityRef, c.entityRef),
              ),
              next,
            ],
          },
        ],
      });
    },
    [lastChange, parent, entity, property, onChange],
  );

  const rowPropChanges: PropertyChange[] = useMemo(() => {
    if (!lastChange) return [];
    return lastChange.modified
      .filter((v) => areMatch(v.ownedEntity.entityRef, entity.entityRef))
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
    ? '#ffcdd2'
    : entity.entityRef.type === 'new'
      ? '#e8f5e9'
      : '#f9f9f9';

  const debouncedPropChanges = useDebounce(rowPropChanges, 800);

  const updatedEntity = useMemo(() => {
    let e = entity;
    if (debouncedPropChanges.length > 0) {
      e = cloneEntity(entity);
      if (
        entity.entityRef.type === 'new' &&
        Object.keys(entity.data).length === 0
      ) {
        // A new entity may be empty to avoid unnecessary data.
        e = materializeNew(
          getSchema(entity.entityRef.schema),
          entity.entityRef.id,
        );
      }
      applyUpdate(e, debouncedPropChanges);
    }
    return e;
  }, [entity, debouncedPropChanges]);

  return (
    <>
      <TableRow
        sx={{
          '& > *': {
            borderBottom: 'unset',
            background,
          },
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <TableCell
          sx={{
            padding: '2px 16px',
            borderColor: 'divider',
          }}
        >
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
        <TableCell
          component="th"
          scope="row"
          sx={{ fontWeight: 500, color: '#333', padding: '2px 16px' }}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: schema.getLabel(updatedEntity.data),
            }}
          ></span>
        </TableCell>
        <TableCell
          align="right"
          sx={{
            padding: '2px 16px',
            borderColor: 'divider',
          }}
        >
          <IconButton
            size="small"
            color={isDeleted ? 'primary' : 'error'}
            onClick={handleDelAction}
            title={isDeleted ? 'Restore' : 'Delete'}
          >
            {isDeleted ? <Restore /> : <Delete />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
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
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
