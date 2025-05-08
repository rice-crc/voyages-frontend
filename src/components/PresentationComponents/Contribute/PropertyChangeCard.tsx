import { getSchema, LinkedEntitySelectionChange, MaterializedEntity, PropertyChange } from '@dotproductdev/voyages-contribute';
import { ReactNode } from 'react';
import PropertyChangesTable from './PropertyChangesTable';
import '@/style/contributeContent.scss';

interface PropertyChangeCardProps {
  change: PropertyChange;
  property?: string
}
export function getMonthName(month: number): string {
  return new Date(2000, month - 1).toLocaleString('default', { month: 'long' });
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


const PropertyChangeCard = ({ change, property}: PropertyChangeCardProps) => {

  let display: ReactNode;

  function getDisplayName(
    changed?: MaterializedEntity | string | number | boolean | null,
    linkedChanges?: LinkedEntitySelectionChange['linkedChanges']
  ): string {
    if (!changed) return "<null>";
    if (typeof changed === 'string' || typeof changed === 'number' || typeof changed === 'boolean') {
      return String(changed);
    }
    const schema = getSchema(changed.entityRef.schema);
    const entityID = changed.entityRef.id
    if (typeof changed === 'object' && 'entityRef' in changed) {

      if (typeof changed === 'object' && 'entityRef' in changed) {
        const labelName = schema.getLabel(changed.data)
        return `${labelName} #${entityID}`;
      }
    }

    return "<unknown>";
  }



  if (change.kind === 'direct') {
    display = <span className="details-changes">{String(change.changed)}</span>;
  } else if (change.kind === 'linked') {
    console.log({ change })
    display = (
      <span className="details-changes">
        {getDisplayName(change.changed)}
      </span>
    );
  } else if (change.kind === 'ownedList') {
    display = (
      <ul className="details-changes" style={{ paddingLeft: '1rem', margin: 0 }}>
        {change.removed.map((r, i) => {
          return (
            <li key={i}>Removed item with id {r.id}</li>
          )
        }
        )}
      </ul>
    );
  } else if (change.kind === 'owned') {
    display = <PropertyChangesTable change={change.changes} sectionName={property} />;
  } else {
    display = <span>Unsupported change type</span>;
  }

  return <>{display} &nbsp;{change.comments && <small>{change.comments}</small>}</>;
};

export default PropertyChangeCard;
