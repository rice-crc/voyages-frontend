import { PropertyChange } from '@dotproductdev/voyages-contribute';
import PropertyChangeCard from './PropertyChangeCard';

interface PropertyChangesListProps {
  changes: PropertyChange[];
  handleDeleteChange: (propertyToDelete: string) => void
  property?: string;
}

const PropertyChangesList = ({ changes, handleDeleteChange }: PropertyChangesListProps) => {
  // Group ownedList changes by property name
  const ownedListGroups: Record<string, any[]> = {};
  changes
    .filter((c): c is Extract<PropertyChange, { kind: 'ownedList' }> => c.kind === 'ownedList')
    .forEach((c) => {
      if (!ownedListGroups[c.property]) ownedListGroups[c.property] = [];
      ownedListGroups[c.property].push(...c.modified, ...c.removed);
    });

  return (
    <>
      {/* Render grouped ownedList sections only once */}
      {Object.entries(ownedListGroups).map(([property, items], idx) => {
        const allChanges = items.flatMap((item) => item.changes || []);
        if (allChanges.length === 0) return null;

        return (
          <div key={`owned-${idx}`} className="property-card">
            <PropertyChangeCard
              change={{
                kind: 'ownedList',
                modified: items,
                removed: [],
                property,
              }}
              property={property}
              handleDeleteChange={handleDeleteChange}
            />
          </div>
        );
      })}

      {changes
        .filter((pc) => pc.kind !== 'ownedList')
        .map((pc, idxPC) => (
          <div key={`change-${idxPC}`} className="property-card">
            <PropertyChangeCard change={pc} property={pc.property} handleDeleteChange={handleDeleteChange}/>
          </div>
        ))}
    </>
  );
};

export default PropertyChangesList;
