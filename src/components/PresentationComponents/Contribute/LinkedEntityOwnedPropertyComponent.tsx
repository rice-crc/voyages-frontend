import {
  DirectPropertyChange,
  EntityChange,
  LinkedEntitySelectionChange,
  MaterializedEntity,
  materializeNew,
  LinkedEntityProperty,
  getSchema,
} from '@dotproductdev/voyages-contribute';
import { Button} from 'antd';
import { useCallback,  useMemo,  } from 'react';
import { EntityForm, EntityFormProps } from './EntityForm';

export interface LinkedEntityPropertyComponentProps {
  property: LinkedEntityProperty;
  entity: MaterializedEntity;
  lastChange?: LinkedEntitySelectionChange;
  onChange: EntityFormProps['onChange'];
}

export const LinkedEntityOwnedPropertyComponent = ({
  property,
  entity,
  lastChange,
  changes,
  onChange,
  ...other
}: LinkedEntityPropertyComponentProps & EntityFormProps) => {
  const { label } = property;
  const value = lastChange
    ? lastChange.changed
    : (entity.data[label] as MaterializedEntity | null);
  const schema = getSchema(property.linkedEntitySchema);
  const localChanges: EntityChange[] = useMemo(
    () =>
      value && lastChange?.linkedChanges
        ? [
            {
              type: 'update' as const,
              entityRef: value.entityRef,
              changes: lastChange.linkedChanges,
            },
          ]
        : [],
    [changes, value, entity],
  );
  const handleClear = useCallback(() => {
    if (value === null) {
      return;
    }
    onChange({
      type: 'update',
      entityRef: entity.entityRef,
      changes: [
        {
          kind: 'linked',
          property: property.uid,
          changed: null,
        },
      ],
    });
    onChange({
      type: 'delete',
      entityRef: value.entityRef,
    });
  }, [value, entity, property]);
  const handleSet = useCallback(() => {
    // Materialize a new entity
    const owned = materializeNew(schema, crypto.randomUUID());
    onChange({
      type: 'update',
      entityRef: entity.entityRef,
      changes: [
        {
          kind: 'linked',
          property: property.uid,
          //comments,
          changed: owned,
        },
      ],
    });
  }, [schema, entity, property, onChange]);
  const handleChanges = useCallback(
    (ec: EntityChange) => {
      if (ec.type !== 'update') {
        throw new Error('Unexpected ec type');
      }
      onChange({
        type: 'update',
        entityRef: entity.entityRef,
        changes: [
          {
            kind: 'linked',
            property: property.uid,
            changed: value,
            linkedChanges: ec.changes.filter(
              (c) => c.kind === 'direct',
            ) as DirectPropertyChange[],
          },
        ],
      });
    },
    [entity, property, value, onChange],
  );
  return (
    <>
      {value ? (
        <Button onClick={handleClear}>Clear</Button>
      ) : (
        <Button onClick={handleSet}>Set</Button>
      )}
      {value && (
        <div style={{ marginLeft: '24px' }}>
          <EntityForm
            key={value.entityRef.id}
            {...other}
            changes={localChanges}
            schema={schema}
            entity={value}
            onChange={handleChanges}
          />
        </div>
      )}
    </>
  );
};