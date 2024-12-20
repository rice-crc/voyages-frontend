import {
  areMatch,
  DirectPropertyChange,
  EntityChange,
  EntityRef,
  EntityUpdate,
  isEntityRef,
  isUpdateEntityChange,
  LinkedEntitySelectionChange,
  PropertyChange,
} from '@/models/changeSets';
import { ChangeSet } from '@/models/contribution';
import { EntitySchema, getSchema } from '@/models/entities';
import {
  isMaterializedEntity,
  MaterializedEntity,
} from '@/models/materialization';
import {
  BoolProperty,
  LinkedEntityProperty,
  NumberProperty,
  Property,
  TextProperty,
} from '@/models/properties';
import { Collapse, CollapseProps, Form, Input, Select, Typography } from 'antd';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import { Popover } from '@mui/material';
import TextArea from 'antd/es/input/TextArea';
import { Delete } from '@mui/icons-material';

export interface ContributionFormProps {
  entity: MaterializedEntity;
  // onUpdate: (contribution: Contribution) => void;
}

export interface EntityFormV2Props {
  schema: EntitySchema;
  entity: MaterializedEntity;
  changes: EntityChange[];
  onChange: (change: EntityChange) => void;
  /*
    entity: MaterializedEntity
    changeSet: ChangeSet
    onUpdate: (changeSet: ChangeSet) => void
    */
}

interface EntityPropertyComponentProps extends EntityFormV2Props {
  property: Property;
  entity: MaterializedEntity;
}

const addLabel = (item: ReactNode, label: string) => {
  return (
    <Form.Item
      label={<span className="form-contribute-label">{label}</span>}
      name={label}
      style={{ marginBottom: 0 }}
    >
      {item}
    </Form.Item>
  );
};

interface EntityPropertyChangeCommentBoxProps {
  property: Property;
  current?: string;
  onComment: (comment: string) => void;
}

const EntityPropertyChangeCommentBox = ({
  property,
  current,
  onComment,
}: EntityPropertyChangeCommentBoxProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          position: 'absolute',
          right: '-15px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        aria-label="add comment"
      >
        <CommentIcon />
      </IconButton>
      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <TextArea
          rows={3}
          value={current ?? ''}
          placeholder={`Please type your comments for ${property.label} here`}
          onChange={(e) => onComment(e.target.value)}
          style={{ width: '100%' }}
        />
      </Popover>
    </>
  );
};

interface DirectEntityPropertyFieldProps {
  property: TextProperty | NumberProperty | BoolProperty;
  entity: MaterializedEntity;
  lastChange?: DirectPropertyChange;
  onChange: EntityFormV2Props['onChange'];
}

const DirectEntityPropertyField = ({
  property,
  entity,
  lastChange,
  onChange,
}: DirectEntityPropertyFieldProps) => {
  const { kind, label } = property;
  const [comments, setComments] = useState<string | undefined>();
  const value = lastChange
    ? lastChange.changed
    : (entity.data[label] as DirectPropertyChange['changed']);
  const handleChange = useCallback(
    (changed: DirectPropertyChange['changed']) => {
      if (
        changed === (lastChange?.changed ?? value) &&
        comments === lastChange?.comments
      ) {
        return;
      }
      onChange({
        type: 'update',
        entityRef: entity.entityRef,
        changes: [
          {
            kind: 'direct',
            property: property.uid,
            changed,
            comments,
          },
        ],
      });
    },
    [onChange, entity, property, lastChange, value, comments],
  );
  useEffect(() => handleChange(value), [handleChange, value, comments]);
  if (
    value !== null &&
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'boolean'
  ) {
    return (
      <span>BUG: Value type is incorrect for DirectEntityPropertyField</span>
    );
  }
  return (
    <>
      <Input
        className={lastChange ? 'changedEntityProperty' : undefined}
        type={kind}
        placeholder={`Please type ${label}`}
        style={{ width: 'calc(100% - 20px)' }}
        value={value + ''}
        onChange={(e: any) => handleChange(e.target.value)}
      />
      <EntityPropertyChangeCommentBox
        property={property}
        current={comments}
        onComment={setComments}
      />
    </>
  );
};

interface LinkedEntityPropertyComponentProps {
  property: LinkedEntityProperty;
  entity: MaterializedEntity;
  lastChange?: LinkedEntitySelectionChange;
  onChange: EntityFormV2Props['onChange'];
}

const LinkedEntityPropertyComponent = ({
  property,
  entity,
  lastChange,
  onChange,
}: LinkedEntityPropertyComponentProps) => {
  const [comments, setComments] = useState<string | undefined>();
  const { label } = property;
  const value = lastChange
    ? lastChange.changed
    : (entity.data[label] as EntityRef | null);
  if (value && !isEntityRef(value)) {
    return <span>BUG: Expected an entity reference value!</span>;
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
        item === ((lastChange?.changed ?? value)?.id ?? null) &&
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
                  id: item,
                  schema: property.linkedEntitySchema,
                  type: 'existing',
                }
              : null,
          },
        ],
      });
    },
    [onChange, entity, property, comments, lastChange, value],
  );
  useEffect(
    () => handleChange(value?.id ?? null),
    [handleChange, value, comments],
  );
  return (
    <>
      <Select
        className={lastChange ? 'changedEntityProperty' : undefined}
        value={value?.id}
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

const EntityPropertyComponent = ({
  property,
  entity,
  ...other
}: EntityPropertyComponentProps) => {
  const { uid, kind, label } = property;
  if (kind === 'entityOwned') {
    const value = entity.data[property.label];
    if (
      isMaterializedEntity(value) &&
      value.entityRef.schema === property.linkedEntitySchema
    ) {
      return (
        <EntityFormV2
          {...other}
          schema={getSchema(property.linkedEntitySchema)}
          entity={value}
        />
      );
    } else {
      return (
        <span>
          BUG: expected a materialized value of the correct entity type.
        </span>
      );
    }
  }
  const localChanges = other.changes.find(
    (ec) =>
      isUpdateEntityChange(ec) && areMatch(ec.entityRef, entity.entityRef),
  ) as EntityUpdate | undefined;
  const lastChange = localChanges?.changes.find((c) => c.property === uid);
  if (kind === 'text' || kind === 'number' || kind === 'bool') {
    if (lastChange && lastChange.kind !== 'direct') {
      return (
        <span>BUG: Only Direct changes are accepted for this property</span>
      );
    }
    return (
      <DirectEntityPropertyField
        property={property}
        entity={entity}
        lastChange={lastChange}
        {...other}
      />
    );
  }
  if (kind === 'linkedEntity') {
    // Update the value if there are changes.
    if (lastChange && lastChange.kind !== 'linked') {
      return (
        <span>
          BUG: only Link changes are supported for this type of property!
        </span>
      );
    }
    return (
      <LinkedEntityPropertyComponent
        property={property}
        entity={entity}
        lastChange={lastChange}
        {...other}
      />
    );
  }
  return null;
};

export const EntityFormV2 = ({
  schema,
  entity,
  changes,
  onChange,
}: EntityFormV2Props) => {
  const [expandedMenu, setExpandedMenu] = useState<string[]>([]);
  const { properties } = schema;
  const children = useMemo(
    () =>
      properties.map((p) => {
        const component = (
          <EntityPropertyComponent
            key={p.uid}
            schema={schema}
            entity={entity}
            property={p}
            changes={changes}
            onChange={onChange}
          />
        );
        return p.kind === 'bool' ||
          p.kind === 'text' ||
          p.kind === 'number' ||
          p.kind === 'linkedEntity'
          ? addLabel(component, p.label)
          : component;
      }),
    [schema, properties, entity, changes, onChange],
  );
  // Group by sections (if any).
  const [ungrouped, sections] = useMemo(() => {
    const map: Record<string, ReactNode[]> = {};
    for (let i = 0; i < properties.length; ++i) {
      (map[properties[i].section ?? ''] ??= []).push(children[i]!);
    }
    const collapsible: CollapseProps['items'] = [];
    for (const [section, items] of Object.entries(map)) {
      let group = <>{items}</>;
      if (section !== '') {
        // Wrap the group in a collapsible section.
        collapsible.push({
          key: section,
          label: (
            <Typography.Title level={4} className="collapse-title">
              {section}
            </Typography.Title>
          ),
          children: items,
        });
      }
    }
    return [map[''], collapsible];
  }, [properties, children]);
  return (
    <>
      {ungrouped}
      {sections.length > 0 && (
        <div className="collapse-container">
          <Collapse
            activeKey={expandedMenu}
            items={sections}
            onChange={(keys) => setExpandedMenu(keys as string[])}
            bordered={false}
            ghost
            className="custom-collapse"
          />
        </div>
      )}
    </>
  );
};

interface PropertyChangeCardProps {
  change: PropertyChange;
  onDelete: (change: PropertyChange) => void;
}

const PropertyChangeCard = ({ change, onDelete }: PropertyChangeCardProps) => {
  const { property } = change;
  let display: ReactNode = undefined;
  if (change.kind === 'direct') {
    display = <b>{change.changed + ''}</b>;
  } else if (change.kind === 'linked') {
    const { changed } = change;
    display = <b>{changed ? `${changed.schema} ${changed.id}` : '<null>'}</b>;
  }
  // TODO: other kinds
  return (
    <>
      <IconButton onClick={() => onDelete(change)}>
        <Delete />
      </IconButton>
      <span>
        {property}
        {' => '}
      </span>
      {display}
      &nbsp;
      <small>{change.comments}</small>
    </>
  );
};

export const ContributionForm = ({ entity }: ContributionFormProps) => {
  const schema = getSchema(entity.entityRef.schema);
  const [changeSet, setChangeSet] = useState<ChangeSet>({
    id: -1,
    author: 'Mocked',
    title: '<Title of contribution>',
    changes: [],
    comments: '',
    timestamp: new Date().getDate(),
  });
  // TODO: debounce changeSet and update the Contribution
  const onChangesUpdate = useCallback(
    (c: EntityChange) => {
      // Merge the change with our change set.
      const next = [...changeSet.changes];
      if (c.type === 'update') {
        const idx = next.findIndex(
          (ec) => ec.type === 'update' && areMatch(ec.entityRef, c.entityRef),
        );
        if (idx < 0 || next[idx].type !== 'update') {
          next.push(c);
        } else {
          let changes = next[idx].changes;
          // If the same property is being changed repeatedly, just update the
          // last change instead of creating a large sequence of changes to the
          // same property.
          if (
            c.changes.length === 1 &&
            changes.length > 0 &&
            changes[0].property === c.changes[0].property
          ) {
            changes = [...changes];
            changes[0] = c.changes[0];
          } else {
            changes = [...c.changes, ...next[idx].changes];
          }
          next[idx] = {
            ...next[idx],
            changes,
          };
        }
      } else {
        next.push(c);
      }
      setChangeSet({ ...changeSet, changes: next });
    },
    [changeSet],
  );
  const handleChangeDelete = useCallback(
    (change: PropertyChange) => {
      const location = changeSet.changes
        .filter((ec) => ec.type === 'update')
        .map((ec, idxEC) => {
          const match = ec.changes.indexOf(change);
          return match >= 0 ? ([idxEC, match] as [number, number]) : undefined;
        })
        .find((m) => !!m);
      if (location) {
        const [idxEC, idxPC] = location;
        const changes = [...changeSet.changes];
        const modified = changes[idxEC] as EntityUpdate;
        const propChanges = [...modified.changes];
        propChanges.splice(idxPC, 1);
        if (propChanges.length > 0) {
          changes[idxEC] = { ...modified, changes: propChanges };
        } else {
          changes.splice(idxEC);
        }
        setChangeSet({ ...changeSet, changes });
      }
    },
    [changeSet],
  );
  return (
    <>
      <ul>
        {/* TODO: A list view of the changes in a nice format */}
        {changeSet.changes.map((ec, idxEC) => {
          const details =
            ec.type === 'update' ? (
              <ul>
                {ec.changes.map((pc, idxPC) => (
                  <li key={idxPC}>
                    <PropertyChangeCard
                      change={pc}
                      onDelete={handleChangeDelete}
                    />
                  </li>
                ))}
              </ul>
            ) : null;
          return (
            <li key={idxEC}>
              {ec.type} @ {ec.entityRef.schema}#{ec.entityRef.id}
              {details}
            </li>
          );
        })}
      </ul>
      <EntityFormV2
        schema={schema}
        entity={entity}
        changes={changeSet.changes}
        onChange={onChangesUpdate}
      />
    </>
  );
};
