import { LinkedEntitySelectionChange } from "@/models/changeSets";
import { isMaterializedEntity, MaterializedEntity, materializeNew } from "@/models/materialization";
import { EntityLinkEditMode, LinkedEntityProperty } from "@/models/properties";
import { Button, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { EntityForm, EntityFormProps } from "./EntityForm";
import { EntityPropertyChangeCommentBox } from "./EntityPropertyChangeCommentBox";
import { getSchema } from "@/models/entities";

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
  onChange,
  ...other
}: LinkedEntityPropertyComponentProps & EntityFormProps) => {
  const { label } = property;
  const value = lastChange
    ? lastChange.changed
    : (entity.data[label] as MaterializedEntity | null);
  const schema = getSchema(property.linkedEntitySchema);
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
            {...other}
            schema={schema}
            entity={value}
            onChange={onChange}
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
  const { mode, label } = property;
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
  const mockOptions = [1, 2, 3, 4, 5, 6].map((_, i) => ({
    label: `Mocked ${property.linkedEntitySchema} with id ${i}`,
    value: i,
  }));
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
            property: property.uid,
            comments,
            changed: item
              ? {
                  entityRef: {
                    id: item,
                    schema: property.linkedEntitySchema,
                    type: 'existing',
                  },
                  data: {},
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
    [handleChange, value, comments],
  );
  return (
    <>
      <Select
        className={lastChange ? 'changedEntityProperty' : undefined}
        value={value?.entityRef.id}
        placeholder={`Please select ${label}`}
        style={{ width: 'calc(100% - 20px)' }}
        options={mockOptions}
        onChange={handleChange}
      />
      <EntityPropertyChangeCommentBox
        property={property}
        current={comments}
        onComment={setComments}
      />
    </>
  );
};