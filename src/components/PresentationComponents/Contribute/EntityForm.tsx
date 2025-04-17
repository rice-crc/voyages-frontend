import {EntityChange,} from '@/models/changeSets';
import { EntitySchema} from '@/models/entities';
import {MaterializedEntity} from '@/models/materialization';
import { PropertyAccessLevel } from '@/models/properties';
import {
  Collapse,
  CollapseProps,
  Form,
  Typography
} from 'antd';
import React, {
  ReactNode,
  useMemo,
  useEffect,
} from 'react';
import { EntityPropertyComponent } from './EntityPropertyComponent';

export interface ContributionFormProps {
  entity: MaterializedEntity;
  // onUpdate: (contribution: Contribution) => void;
}

export interface EntityFormProps {
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
  onSectionsChange?: (sections: CollapseProps['items']) => void;
}


export const EntityForm = ({
  schema,
  entity,
  changes,
  onChange,
  expandedMenu,
  setExpandedMenu,
  accessLevel,
  onSectionsChange,
}: EntityFormProps) => {
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

    return [map[''] ?? [], collapsible];
  }, [properties, children]);

  useEffect(() => {
    onSectionsChange?.(sections);
  }, [sections, onSectionsChange]);

  return (
   <>
      {ungrouped.length > 0 &&
        ungrouped.map((item, index) => (
          <div key={`ungrouped-${index}`}>{item}</div>
        ))}
      {sections.length > 0 && (
        <div>
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
    </>
  );
};

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
