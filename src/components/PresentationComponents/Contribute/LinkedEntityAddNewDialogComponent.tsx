import { useCallback, useEffect, useState } from 'react';

import {
  LinkedEntitySelectionChange,
  MaterializedEntity,
  LinkedEntityProperty,
  getSchema,
  materializeNew,
  EntityChange,
  EntityUpdate,
  addToChangeSet,
} from '@dotproductdev/voyages-contribute';
import { Close } from '@mui/icons-material';
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Form } from 'antd';

import { StyleDialog } from '@/styleMUI';

import { EntityForm, EntityFormProps } from './EntityForm';

import '@/style/contributeContent.scss';
import {
  PaperDraggableLinkEntityAddComponent,
  PaperDraggableLinkEntityModifyComponent,
} from '@/components/SelectorComponents/Cascading/PaperDraggable';
import FooterModal from '@/components/commonComponents/FooterModal';

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
  const [draggable, setDraggable] = useState('add');
  const [addedEntity, setAddedEntity] = useState<
    MaterializedEntity | undefined
  >(undefined);
  const [localChanges, setLocalChanges] = useState<EntityUpdate | undefined>();
  const linkedSchema = getSchema(linkedEntitySchema);
  console.log({ draggable });
  const onClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let selected = lastChange?.changed;
    selected =
      selected && selected.entityRef.type === 'new' ? selected : undefined;
    setAddedEntity(selected);
    setLocalChanges(
      selected && lastChange?.linkedChanges
        ? {
            type: 'update',
            entityRef: selected.entityRef,
            changes: lastChange.linkedChanges,
          }
        : undefined,
    );
  }, [lastChange]);

  const editAdded = useCallback(
    (e: MaterializedEntity | null, changes?: EntityUpdate) => {
      const localPropChanges = changes ? changes.changes : [];
      onChange({
        type: 'update',
        entityRef: entity.entityRef,
        changes: [
          {
            kind: 'linked',
            property: uid,
            comments,
            changed: e,
            linkedChanges: localPropChanges,
          },
        ],
      });
    },
    [onChange, entity, uid, comments],
  );

  const handleAddOrModify = useCallback(
    (check: string) => {
      if (addedEntity === undefined) {
        const added = materializeNew(linkedSchema, crypto.randomUUID());
        editAdded(added, localChanges);
      }
      if (check === 'modify') {
        setDraggable('modify');
      } else {
        setDraggable('add');
      }
      setOpen(true);
    },
    [addedEntity, linkedSchema, editAdded, localChanges],
  );

  const handleClear = useCallback(() => {
    setLocalChanges(undefined);
    setAddedEntity(undefined);
    editAdded(null);
  }, [editAdded]);

  const handleLocalChanges = useCallback(
    (c: EntityChange) => {
      if (addedEntity === undefined) {
        alert('Invalid state: addedEntity is undefined');
        return;
      }
      if (c.type !== 'update') {
        alert('Unexpected change type');
        return;
      }
      if (localChanges !== undefined) {
        const merged = addToChangeSet([localChanges], c);
        if (merged.length !== 1 || merged[0].type !== 'update') {
          alert('Unexpected merged changes result');
          return;
        }
        c = merged[0];
      }
      setLocalChanges(c);
      editAdded(addedEntity, c);
    },
    [addedEntity, editAdded],
  );
  console.log({ addedEntity });
  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 2, mb: 2, justifyContent: 'center' }}
      >
        <Button
          variant="contained"
          onClick={() => {
            const isAddOrModyfy = addedEntity !== undefined ? 'modify' : 'add';
            handleAddOrModify(isAddOrModyfy);
          }}
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
        sx={{
          ...StyleDialog,
          '& .MuiDialog-paper': {
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '80vh',
          },
        }}
        fullWidth
        maxWidth="sm"
        PaperComponent={
          draggable === 'modify'
            ? PaperDraggableLinkEntityModifyComponent
            : PaperDraggableLinkEntityAddComponent
        }
        aria-labelledby={
          draggable === 'modify'
            ? 'draggable-dialog-modify'
            : 'draggable-dialog-add-new'
        }
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
          <div style={{ fontSize: '1rem' }}>
            Add new {linkedEntitySchema.replace(/([A-Z])/g, ' $1').trim()}{' '}
            entity
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

        <DialogContent
          style={{
            padding: 26,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {open && addedEntity && (
            <Form>
              <EntityForm
                {...other}
                changes={localChanges ? [localChanges] : []}
                schema={linkedSchema}
                entity={addedEntity}
                onChange={handleLocalChanges}
              />
            </Form>
          )}
        </DialogContent>
        <FooterModal content="" />
      </Dialog>
    </>
  );
};

export default LinkedEntityAddNewComponent;
