import { PropertyChange } from '@dotproductdev/voyages-contribute';
import { ReactNode } from 'react';
import PropertyChangesTable from './PropertyChangesTable';
import '@/style/contributeContent.scss';

interface PropertyChangeCardProps {
  change: PropertyChange;
  property?: string
}

const PropertyChangeCard = ({ change,property }: PropertyChangeCardProps) => {
  let display: ReactNode;

  if (change.kind === 'direct') {
    display = <span className="details-changes">{String(change.changed)}</span>;
  } else if (change.kind === 'linked') {
    const { changed } = change;
    display = changed ? (
      <span className="details-changes">
        {changed.entityRef.schema}#{changed.entityRef.id}
      </span>
    ) : (
      '<null>'
    );
  } else if (change.kind === 'ownedList') {
    display = (
      <ul className="details-changes" style={{ paddingLeft: '1rem', margin: 0 }}>
        {change.removed.map((r, i) => {
            console.log({r: r})
            return (
                  <li key={i}>Removed item with id {r.id}</li>
                )
        }
        )}
      </ul>
    );
  } else if (change.kind === 'owned') {
    display = <PropertyChangesTable change={change.changes} sectionName={property}/>;
  } else {
    display = <span>Unsupported change type</span>;
  }

  return <>{display} &nbsp;{change.comments && <small>{change.comments}</small>}</>;
};

export default PropertyChangeCard;
