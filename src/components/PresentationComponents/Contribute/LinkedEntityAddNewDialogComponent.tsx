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
import { Button, } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { EntityForm, EntityFormProps } from './EntityForm';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { StyleDialog } from '@/styleMUI';
import { Close } from '@mui/icons-material';
import { useDebounce } from '@/hooks/useDebounce';
import '@/style/contributeContent.scss';
import { PaperDraggable } from '@/components/SelectorComponents/Cascading/PaperDraggable';

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
                PaperComponent={PaperDraggable}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle sx={{ cursor: 'move' }} id="draggable-dialog-title">
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
                <DialogContent style={{ textAlign: 'center' }}>
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

export default LinkedEntityAddNewComponent