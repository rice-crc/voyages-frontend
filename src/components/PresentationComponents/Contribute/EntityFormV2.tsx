import {
  addToChangeSet,
  areMatch,
  deleteChange,
  DirectPropertyChange,
  dropOrphans,
  EntityChange,
  EntityUpdate,
  isUpdateEntityChange,
  LinkedEntitySelectionChange,
  mergePropertyChange,
  PropertyChange,
} from '@/models/changeSets';
import { ChangeSet } from '@/models/contribution';
import { EntitySchema, getSchema } from '@/models/entities';
import {
  isMaterializedEntity,
  MaterializedEntity,
  materializeNew,
} from '@/models/materialization';
import {
  BoolProperty,
  EntityLinkEditMode,
  LinkedEntityProperty,
  NumberProperty,
  Property,
  PropertyAccessLevel,
  TextProperty,
} from '@/models/properties';
import { RootState } from '@/redux/store';
import { translationLanguagesContribute } from '@/utils/functions/translationLanguages';
import { Delete } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import {
  Button,
  Collapse,
  CollapseProps,
  Form,
  Input,
  Select,
  Typography,
} from 'antd';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { EntityPropertyChangeCommentBox } from './EntityPropertyChangeCommentBox';
import NumbersTableComponent from './NumbersTableComponent';

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
  expandedMenu: string[];
  setExpandedMenu: React.Dispatch<React.SetStateAction<string[]>>;
  accessLevel: PropertyAccessLevel;
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

const LinkedEntityOwnedPropertyComponent = ({
  property,
  entity,
  lastChange,
  onChange,
  ...other
}: LinkedEntityPropertyComponentProps & EntityFormV2Props) => {
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
          <EntityFormV2
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

const LinkedEntityPropertyComponent = (
  props: LinkedEntityPropertyComponentProps & EntityFormV2Props,
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

const EntityPropertyComponent = ({
  property,
  entity,
  ...other
}: EntityPropertyComponentProps) => {
  const { uid, kind } = property;
  const localChanges = other.changes.find(
    (ec) =>
      isUpdateEntityChange(ec) && areMatch(ec.entityRef, entity.entityRef),
  ) as EntityUpdate | undefined;
  const lastChange = localChanges?.changes.find((c) => c.property === uid);
  if (kind === 'entityOwned') {
    const value = entity.data[property.label];
    if (lastChange && lastChange.kind !== 'owned') {
      return <span>BUG: unexpected change type for Owned entity.</span>;
    }
    if (
      isMaterializedEntity(value) &&
      value.entityRef.schema === property.linkedEntitySchema
    ) {
      return (
        <EntityFormV2
          {...other}
          changes={
            lastChange
              ? [
                  {
                    entityRef: lastChange.ownedEntityId,
                    type: 'update',
                    changes: lastChange.changes,
                  },
                ]
              : []
          }
          onChange={(c) =>
            c.type === 'update' &&
            other.onChange({
              type: 'update',
              entityRef: entity.entityRef,
              changes: [
                {
                  property: property.uid,
                  kind: 'owned',
                  ownedEntityId: value.entityRef,
                  changes: c.changes,
                },
              ],
            })
          }
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
  if (kind === 'table') {
    if (lastChange && lastChange.kind !== 'table') {
      return (
        <span>
          BUG: only Table changes are supported for this type of property!
        </span>
      );
    }
    return (
      <NumbersTableComponent
        property={property}
        entity={entity}
        lastChange={lastChange}
        {...other}
      />
    );
  }
  if (kind === 'ownedEntityList') {
  }
  return null;
};

export const EntityFormV2 = ({
  schema,
  entity,
  changes,
  onChange,
  expandedMenu,
  setExpandedMenu,
  accessLevel,
}: EntityFormV2Props) => {
  const properties = useMemo(
    () =>
      schema.properties.filter(
        (p) => p.accessLevel === undefined || p.accessLevel <= accessLevel,
      ),
    [schema, accessLevel],
  );
  const children = useMemo(
    () =>
      properties.map((p) => {
        const component = (
          <>
            <EntityPropertyComponent
              key={p.uid}
              schema={schema}
              expandedMenu={expandedMenu}
              setExpandedMenu={setExpandedMenu}
              entity={entity}
              property={p}
              changes={changes}
              onChange={onChange}
              accessLevel={accessLevel}
            />
          </>
        );

        return p.kind === 'bool' ||
          p.kind === 'text' ||
          p.kind === 'number' ||
          p.kind === 'linkedEntity'
          ? addLabel(component, p.label)
          : component;
      }),
    [
      properties,
      accessLevel,
      schema,
      expandedMenu,
      setExpandedMenu,
      entity,
      changes,
      onChange,
    ],
  );

  // Group by sections (if any).
  const [ungrouped, sections] = useMemo(() => {
    const map: Record<string, ReactNode[]> = {};
    for (let i = 0; i < properties.length; ++i) {
      (map[properties[i].section ?? ''] ??= []).push(children[i]!);
    }
    const collapsible: CollapseProps['items'] = [];
    for (const [section, items] of Object.entries(map)) {
      if (section !== '') {
        collapsible.push({
          key: `${items.map((item) => {
            if (React.isValidElement(item)) {
              return item.props.children.key;
            } else {
              return item?.toString();
            }
          })}`,
          label: (
            <Typography.Title level={4} className="collapse-title">
              {section}
            </Typography.Title>
          ),
          children: (
            <div>
              {items.map((item, index) => (
                <div key={`${section}-${index}`}>{item}</div>
              ))}
            </div>
          ),
        });
      }
    }

    return [map[''] || [], collapsible];
  }, [properties, children]);

  return (
    <div>
      {ungrouped.length > 0 &&
        ungrouped.map((item, index) => (
          <div key={`ungrouped-${index}`}>{item}</div>
        ))}

      {sections.length > 0 && (
        <div className="collapse-container">
          <Collapse
            activeKey={expandedMenu}
            onChange={(keys) => {
              setExpandedMenu(keys as string[]);
            }}
            bordered={false}
            items={sections}
            ghost
            className="custom-collapse"
          />
        </div>
      )}
    </div>
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
    display = (
      <b>
        {changed
          ? `${changed.entityRef.schema} ${changed.entityRef.id}`
          : '<null>'}
      </b>
    );
  }
  if (change.kind === 'owned') {
    display = (
      <div style={{ paddingLeft: '20px' }}>
        <PropertyChangesList changes={change.changes} onDelete={onDelete} />
      </div>
    );
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

const accessLevelOptions = Object.entries(PropertyAccessLevel)
  .filter(([key]) => isNaN(Number(key))) // Filter out reverse mapping
  .map(([label, value]) => ({
    label: label.replace(/([A-Z])/g, ' $1').trim(), // Add spaces between camel case
    value: value,
  }));

interface PropertyChangesListProps {
  changes: PropertyChange[];
  onDelete: (change: PropertyChange) => void;
}

const PropertyChangesList = ({
  changes,
  onDelete,
}: PropertyChangesListProps) => {
  return (
    <ul>
      {changes.map((pc, idxPC) => (
        <li key={idxPC}>
          <PropertyChangeCard change={pc} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
};

export const ContributionForm = ({ entity }: ContributionFormProps) => {
  const [accessLevel, setAccessLevel] = useState<PropertyAccessLevel>(
    PropertyAccessLevel.AdvancedContributor,
  );
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
    (c: EntityChange) =>
      setChangeSet((current) => {
        // Merge the change with our change set.
        const next = addToChangeSet(current.changes, c);
        // TODO: keep the change set clear of orphans
        const orphans = dropOrphans(entity, next);
        console.dir(orphans, { depth: null });
        return { ...current, changes: next };
      }),
    [entity, setChangeSet],
  );
  const handleChangeDelete = useCallback(
    (change: PropertyChange) =>
      setChangeSet((current) => {
        const next = [...current.changes];
        for (let i = 0; i < next.length; ++i) {
          const c = next[i];
          if (c.type !== 'update') {
            continue;
          }
          const copy = [...c.changes];
          const delCount = deleteChange(copy, change);
          if (delCount) {
            next[i] = { ...c, changes: copy };
            break;
          }
        }
        return { ...current, changes: next };
      }),
    [setChangeSet],
  );

  const [globalExpand, setGlobalExpand] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string[]>([]);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const translatedcontribute = translationLanguagesContribute(languageValue);

  const toggleExpandAll = () => {
    if (globalExpand) {
      setExpandedMenu([]);
    } else {
      setExpandedMenu(schema.properties.map((item) => item.uid as string));
    }
    setGlobalExpand((prevState) => !prevState);
  };

  return (
    <>
      <ul>
        {/* TODO: A list view of the changes in a nice format */}
        {changeSet.changes.map((ec, idxEC) => {
          const details =
            ec.type === 'update' ? (
              <PropertyChangesList
                changes={ec.changes}
                onDelete={handleChangeDelete}
              />
            ) : null;
          return (
            <li key={idxEC}>
              {ec.type} @ {ec.entityRef.schema}#{ec.entityRef.id}
              {details}
            </li>
          );
        })}
      </ul>
      {/* TODO: for now it is ok to allow the choice of "Editor" here, but this
      will have to be blocked for non-editors using authz */}
      <Select
        value={accessLevel}
        onChange={(value: PropertyAccessLevel) => setAccessLevel(value)}
        options={accessLevelOptions}
        style={{ width: 200 }}
      />
      <div className="expand-collapse">
        {translatedcontribute.titleCollaps}{' '}
        <a href="#" onClick={toggleExpandAll}>
          {!globalExpand
            ? translatedcontribute.expand
            : translatedcontribute.collapse}
        </a>{' '}
      </div>
      <EntityFormV2
        schema={schema}
        entity={entity}
        changes={changeSet.changes}
        onChange={onChangesUpdate}
        setExpandedMenu={setExpandedMenu}
        expandedMenu={expandedMenu}
        accessLevel={accessLevel}
      />
    </>
  );
};
