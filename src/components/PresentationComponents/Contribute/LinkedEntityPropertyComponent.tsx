import {
  LinkedEntitySelectionChange,
  isMaterializedEntity,
  MaterializedEntity,
  EntityLinkEditMode,
  LinkedEntityProperty,
  getSchema,
} from '@dotproductdev/voyages-contribute';
import { Alert,  Select, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EntityFormProps } from './EntityForm';
import { EntityPropertyChangeCommentBox } from './EntityPropertyChangeCommentBox';
import { useEnumeration } from '@/hooks/useEnumeration';
import TreeSelectedEntity from './commonContribute/TreeSelectedEntity';
import { LinkedEntityOwnedPropertyComponent } from './LinkedEntityOwnedPropertyComponent';
import { useTreeSelectedContributeLocation } from '@/hooks/useTreeSelectedContribute';
import '@/style/contributeContent.scss';
import LinkedEntityAddNewDialogComponent from './LinkedEntityAddNewDialogComponent';

export interface LinkedEntityPropertyComponentProps {
  property: LinkedEntityProperty;
  entity: MaterializedEntity;
  lastChange?: LinkedEntitySelectionChange;
  onChange: EntityFormProps['onChange'];
}

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

  const { locationsList, loading, error } = useTreeSelectedContributeLocation(
    linkedEntitySchema,
    {
      expirationSeconds: 300,
    },
  );
  const options = useMemo(() => {
    const res = optionItems.map((entity) => ({
      label: linkedSchema.getLabel(entity.data, true),
      value: entity.entityRef.id,
      entity,
    }));

    if (lastChange?.changed?.entityRef.type === 'new') {
      res.push({
        label: linkedSchema.getLabel(lastChange.changed.data, true),
        value: lastChange.changed.entityRef.id,
        entity: lastChange.changed,
      });
    }
    return res;
  }, [optionItems, lastChange?.changed]);


  const handleChange = useCallback(
    (item: string | number | null) => {
      if (item == null) return;

      const currentId = (lastChange?.changed ?? value)?.entityRef.id ?? null;
      if (item === currentId && comments === lastChange?.comments) {
        return;
      }
      const matchedOption = options.find((x) => String(x.value) === String(item));
      if (!matchedOption) {
        console.warn('No matching option found for item:', item);
        return;
      }
      /*
{
    "item": 2,
    "entity": {
        "entityRef": {
            "type": "existing",
            "id": 2,
            "schema": "CargoUnit"
        },
        "data": {
            "Name": "pound",
            "id": 2
        },
        "state": "lazy"
    }
}

      */

      const { entity } = matchedOption;
      console.log({item, entity})
      onChange({
        type: 'update',
        entityRef: entity.entityRef,
        changes: [
          {
            kind: 'linked',
            property: uid,
            comments,
            changed: {
              entityRef: {
                id: item,
                schema: linkedEntitySchema,
                type: 'existing',
              },
              data: entity.data ?? {},
              state: 'lazy',
            },
          },
        ],
      });
    },
    [onChange, entity, property, comments, lastChange, value, options, uid, linkedEntitySchema]
  );
  // useEffect only if external `value` updates should trigger a change
  useEffect(() => {
    handleChange(value?.entityRef.id ?? null);
  }, [handleChange, value]);


  useEffect(() => {
    if (value?.entityRef.id) {
      handleChange(value.entityRef.id);
    }
  }, [handleChange, value]);

  let displaySelected;

  if (property.linkedEntitySchema === 'Location') {
    if (loading) {
      return (
        <Spin spinning={true} tip="Loading location tree...">
          <div style={{ minHeight: 60 }} />
        </Spin>
      );
    }

    if (error) {
      return <Alert type="error" message="Failed to load location data." />;
    }

    displaySelected = (
      <TreeSelectedEntity
        handleChange={handleChange}
        value={value}
        label={label}
        options={options}
        lastChange={lastChange}
        locationsList={locationsList}
      />
    );
  } else {
    displaySelected = (
      <Select
        className={`truncate-select ${lastChange ? 'changedEntityProperty' : ''}`}
        value={value?.entityRef.id}
        placeholder={`Please select ${label}`}
        style={{ width: 'calc(100% - 20px)' }}
        options={options}
        onChange={handleChange}
        showSearch
        filterOption={(input: string, option: any) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    );
  }

  return (
    <>
      {displaySelected}
      {mode === EntityLinkEditMode.Create && (
        <LinkedEntityAddNewDialogComponent {...props} comments={comments} />
      )}
      <EntityPropertyChangeCommentBox
        property={property}
        current={lastChange?.comments}
        onComment={setComments}
      />
    </>
  );
};
