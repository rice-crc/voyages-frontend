import {
  LinkedEntitySelectionChange,
  isMaterializedEntity,
  MaterializedEntity,
  EntityLinkEditMode,
  LinkedEntityProperty,
  getSchema,
  materializeNew,
  EntityChange,
  applyUpdate,
  cloneEntity,
} from '@dotproductdev/voyages-contribute';
import { Alert, Button, Select, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EntityForm, EntityFormProps } from './EntityForm';
import { EntityPropertyChangeCommentBox } from './EntityPropertyChangeCommentBox';
import { useEnumeration } from '@/hooks/useEnumeration';
import TreeSelectedEntity from './commonContribute/TreeSelectedEntity';
import { LinkedEntityOwnedPropertyComponent } from './LinkedEntityOwnedPropertyComponent';
import { useTreeSelectedContributeLocation } from '@/hooks/useTreeSelectedContribute';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { StyleDialog } from '@/styleMUI';
import { Close } from '@mui/icons-material';
import { useDebounce } from '@/hooks/useDebounce';

export interface LinkedEntityPropertyComponentProps {
  property: LinkedEntityProperty;
  entity: MaterializedEntity;
  lastChange?: LinkedEntitySelectionChange;
  onChange: EntityFormProps['onChange'];
}

const LinkedEntityAddNewComponent = (
  props: LinkedEntityPropertyComponentProps &
    EntityFormProps & { comments?: string },
) => {
  const { property, entity, lastChange, comments, onChange, ...other } = props;
  const { linkedEntitySchema, uid } = property;
  const [open, setOpen] = useState(false);
  const [addedEntity, setAddedEntity] = useState<
    MaterializedEntity | undefined
  >(undefined);
  const [localChanges, setLocalChanges] = useState<EntityChange | undefined>();
  const linkedSchema = getSchema(linkedEntitySchema);
  const onClose = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const selected = lastChange?.changed;
    setAddedEntity(
      selected && selected.entityRef.type === 'new' ? selected : undefined,
    );
  }, [addedEntity, lastChange?.changed]);
  const editAdded = useCallback(
    (e: MaterializedEntity | null) =>
      onChange({
        type: 'update',
        entityRef: entity.entityRef,
        changes: [
          {
            kind: 'linked',
            property: uid,
            comments,
            changed: e,
          },
        ],
      }),
    [onChange, entity, uid, comments],
  );
  const handleAddOrModify = useCallback(() => {
    if (addedEntity === undefined) {
      const added = materializeNew(linkedSchema, crypto.randomUUID());
      editAdded(added);
      // setAddedEntity(added);
    }
    setOpen(true);
  }, [addedEntity, editAdded]);
  const debouncedChanges = useDebounce(localChanges, 1000);
  useEffect(() => {
    if (
      !debouncedChanges ||
      addedEntity?.entityRef.id !== debouncedChanges.entityRef.id ||
      debouncedChanges.type !== 'update'
    ) {
      return;
    }
    const modified = cloneEntity(addedEntity);
    editAdded(applyUpdate(modified, {}, debouncedChanges.changes));
  }, [debouncedChanges, editAdded, addedEntity]);
  const handleClear = useCallback(() => {
    editAdded(null);
  }, [editAdded]);
  return (
    <>
      <Button onClick={handleAddOrModify}>
        {addedEntity !== undefined ? 'Modify' : 'Add new'}
      </Button>
      {addedEntity && <Button onClick={handleClear}>Clear</Button>}
      <Dialog
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          backdrop: {
            onClick: (e) => e.stopPropagation(),
          },
        }}
        open={open && addedEntity !== undefined}
        onClose={onClose}
        disableScrollLock={false}
        sx={StyleDialog}
      >
        <DialogTitle sx={{ cursor: 'move' }}>
          <h2 className="header-added-entity">{`Add new ${linkedEntitySchema} entity`}</h2>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {open && addedEntity && (
            <EntityForm
              {...other}
              changes={localChanges ? [localChanges] : []}
              schema={linkedSchema}
              entity={addedEntity}
              onChange={setLocalChanges}
            />
          )}
        </DialogContent>
      </Dialog>
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
        className={lastChange ? 'changedEntityProperty' : undefined}
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
        <LinkedEntityAddNewComponent {...props} comments={comments} />
      )}
      <EntityPropertyChangeCommentBox
        property={property}
        current={lastChange?.comments}
        onComment={setComments}
      />
    </>
  );
};
