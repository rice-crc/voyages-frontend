import {
  LinkedEntitySelectionChange,
  MaterializedEntity,
  LinkedEntityProperty,
  getSchema,
  materializeNew,
  EntityChange,
  applyUpdate,
  cloneEntity,
} from '@dotproductdev/voyages-contribute';
import {
  Button,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Form,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { EntityForm, EntityFormProps } from './EntityForm';
import { StyleDialog } from '@/styleMUI';
import { Close } from '@mui/icons-material';
import { useDebounce } from '@/hooks/useDebounce';
import '@/style/contributeContent.scss';
import { PaperDraggableLinkEntityAddComponent } from '@/components/SelectorComponents/Cascading/PaperDraggable';

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
  const [addedEntity, setAddedEntity] = useState<MaterializedEntity | undefined>(undefined);
  const [localChanges, setLocalChanges] = useState<EntityChange | undefined>();
  const linkedSchema = getSchema(linkedEntitySchema);

  const onClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const selected = lastChange?.changed;
    setAddedEntity(
      selected && selected.entityRef.type === 'new' ? selected : undefined,
    );
  }, [lastChange?.changed]);

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
      <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleAddOrModify}
          className="button-save-contribute"
          sx={{
            cursor: 'pointer',
            textTransform: 'unset',
            height: 32,
            fontSize: '0.85rem',
          }}
        >
          {addedEntity !== undefined ? 'Modify' : 'Add new'}
        </Button>
        {addedEntity && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleClear}
            size="small"
            sx={{
              cursor: 'pointer',
              textTransform: 'unset',
              height: 32,
              fontSize: '0.85rem',
            }}
          >
            Clear
          </Button>
        )}
      </Stack>

      <Dialog
        open={open && addedEntity !== undefined}
        onClose={onClose}
        disableScrollLock={false}
        sx={StyleDialog}
        fullWidth
        maxWidth="sm"
        PaperComponent={PaperDraggableLinkEntityAddComponent}
        aria-labelledby="draggable-dialog-title-contribute"
      >
        <DialogTitle
          sx={{
            cursor: 'move',
            position: 'relative',
            textAlign: 'center',
            fontWeight: 600,
            bgcolor: 'rgb(55, 148, 141)',
            color: '#fff',
            py: 2,
          }}
        >
          <div style={{fontSize: '1rem'}}>
            Add new {linkedEntitySchema.replace(/([A-Z])/g, ' $1').trim()} entity
          </div>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent style={{ padding: 26 }}>
          {open && addedEntity && (
            <Form layout="vertical">
              <EntityForm
                {...other}
                changes={localChanges ? [localChanges] : []}
                schema={linkedSchema}
                entity={addedEntity}
                onChange={setLocalChanges}
              />
            </Form>

          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkedEntityAddNewComponent;
