import {
  DirectPropertyChange,
  EntityChange,
  LinkedEntitySelectionChange,
  isMaterializedEntity,
  MaterializedEntity,
  materializeNew,
  EntityLinkEditMode,
  LinkedEntityProperty,
  getSchema,
  getSchemaProp,
} from '@dotproductdev/voyages-contribute';
import { Button, Select, TreeSelect, TreeSelectProps } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EntityForm, EntityFormProps } from './EntityForm';
import { EntityPropertyChangeCommentBox } from './EntityPropertyChangeCommentBox';
import { useEnumeration } from '@/hooks/useEnumeration';
import TreeSelectedEntity from './commonContribute/TreeSelectedEntity';

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

export const LinkedEntityPropertyComponent = (
  props: LinkedEntityPropertyComponentProps & EntityFormProps,
) => {
  const { property, entity, lastChange, onChange } = props;
  const [comments, setComments] = useState<string | undefined>();
  const { uid, mode, label, linkedEntitySchema } = property;
  const value = lastChange
    ? lastChange.changed
    : (entity.data[label] as MaterializedEntity | null);
  if (value && !isMaterializedEntity(value)) {
    return <span>BUG: Expected an entity reference value!</span>;
  }
  if (mode === EntityLinkEditMode.View) {
    return <span>{value?.entityRef.id ?? 'null'}</span>;
  }
  if (mode === EntityLinkEditMode.Own) {
    return <LinkedEntityOwnedPropertyComponent {...props} />;
  }
  const linkedSchema = getSchema(linkedEntitySchema);
  const { items: optionItems } = useEnumeration(linkedEntitySchema);
  let options = optionItems.map((entity) => ({
    label: linkedSchema.getLabel(entity.data, true),
    value: entity.entityRef.id,
    entity,
  }));
  if (options.length === 0) {
    // TODO: remove this after the Enumeration API is in place.
    const dummyRecord = (fields: string[]) =>
      fields.reduce(
        (rec, f) => ({ ...rec, [f]: `dummy_${f}_${crypto.randomUUID()}` }),
        {} as Record<string, string>,
      );
    const fillEntityWithDummies = (entity: MaterializedEntity) => {
      const schema = getSchema(entity.entityRef.schema);
      const fields = Object.keys(entity.data).filter((label) => {
        const prop = getSchemaProp(schema, label);
        return (
          prop !== undefined && (prop.kind === 'number' || prop.kind === 'text')
        );
      });
      Object.assign(entity.data, dummyRecord(fields));
      return entity;
    };
    options = [1, 2, 3, 4, 5, 6].map((i, _) => ({
      label: `Mocked ${property.linkedEntitySchema} with id ${i}`,
      value: i,
      entity: fillEntityWithDummies(materializeNew(linkedSchema, i)),
    }));
  }
  // TODO: Specialize component for locations.
  /*return property.linkedEntitySchema === Location.name ? (
        <TreeSelect
        placeholder={`Please select ${label}`}
        treeData={treeData}
        style={{ width: 'calc(100% - 20px)' }}
        dropdownStyle={{ overflow: 'auto', zIndex: 1301 }}
        showSearch
        treeCheckable
        allowClear
        multiple
        treeDefaultExpandAll={false}
        maxTagCount={8}
        filterTreeNode={filterTreeNode}
        />
    ) : */
  const handleChange = useCallback(
    (item: string | number | null) => {
      if (
        item === ((lastChange?.changed ?? value)?.entityRef.id ?? null) &&
        comments === lastChange?.comments
      ) {
        return;
      }
      onChange({
        type: 'update',
        entityRef: entity.entityRef,
        changes: [
          {
            kind: 'linked',
            property: uid,
            comments,
            changed: item
              ? {
                  entityRef: {
                    id: item,
                    schema: linkedEntitySchema,
                    type: 'existing',
                  },
                  data:
                    options.find((x) => x.value === item)?.entity.data ?? {},
                  state: 'lazy',
                }
              : null,
          },
        ],
      });
    },
    [onChange, entity, property, comments, lastChange, value],
  );
  useEffect(
    () => handleChange(value?.entityRef.id ?? null),
    [handleChange, value],
  );

  console.log({ property });
  let displaySelected;
  if (property.linkedEntitySchema === 'Location') {
    displaySelected = (
      <TreeSelectedEntity
        handleChange={handleChange}
        value={value}
        label={label}
        options={options}
        lastChange={lastChange}
      />
    );
  } else {
    displaySelected = (
      <Select
        className={lastChange ? 'changedEntityProperty' : undefined}
        value={value?.entityRef.id}
        placeholder={`Please select ${label}`}
        style={{ width: 'calc(100% - 20px)' }}
        options={options}
        onChange={handleChange}
      />
    );
  }

  return (
    <>
      {displaySelected}
      <EntityPropertyChangeCommentBox
        property={property}
        current={comments}
        onComment={setComments}
      />
    </>
  );
};
