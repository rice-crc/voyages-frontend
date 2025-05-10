import { PropertyChange } from '@dotproductdev/voyages-contribute';
import PropertyChangeCard from './PropertyChangeCard';

interface PropertyChangesListProps {
  changes: PropertyChange[];
  property?: string;
  // handleFieldChange: (section: string, fieldName: string, previousValue: any) => void;
}

const PropertyChangesList = ({
  changes,
  property,
}: PropertyChangesListProps) => {
  return (
    <>
      {changes.map((pc, idxPC) => {
        return (
          <div key={idxPC} className="property-card">
            <PropertyChangeCard change={pc} property={pc.property} />
          </div>
        );
      })}
    </>
  );
};

export default PropertyChangesList;
