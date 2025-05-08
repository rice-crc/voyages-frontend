import {
  MaterializedEntity,
  isMaterializedEntity,
  getSchema,
  isUpdateEntityChange,
  areMatch,
  Property,
  EntityUpdate,
} from '@dotproductdev/voyages-contribute';
import { EntityFormProps, EntityForm } from './EntityForm';
import { EntityTableView } from './EntityTableView';
import NumbersTableComponent from './NumbersTableComponent';
import { DirectEntityPropertyField } from './DirectEntityPropertyField';
import { LinkedEntityPropertyComponent } from './LinkedEntityPropertyComponent';
import { EntityPropertyChangeCommentBox } from './EntityPropertyChangeCommentBox';

export interface EntityPropertyComponentProps extends EntityFormProps {
  property: Property;
  entity: MaterializedEntity;
}

export const EntityPropertyComponent = ({
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
        <EntityForm
          key={entity.entityRef.id}
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
           onChange={(c) =>{
            return c.type === 'update' &&
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
      <>
      <NumbersTableComponent
        property={property}
        entity={entity}
        lastChange={lastChange}
        {...other}
      />
    </>
    );
  }
  if (kind === 'ownedEntityList') {
    if (lastChange && lastChange.kind !== 'ownedList') {
      return (
        <span>
          BUG: only Table changes are supported for this type of property!
        </span>
      );
    }
    return (
      <EntityTableView
        lastChange={lastChange}
        entity={entity}
        property={property}
        {...other}
      />
    );
  }
  return <span>BUG: Unknown property {kind}</span>;
};
