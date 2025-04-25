import { Button, List, Badge, Typography, Row, Card } from 'antd';
import { ReloadOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
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
    <div>
      {changes.map((pc, idxPC) => {
        return (
          <div key={idxPC} className="property-card">
            <PropertyChangeCard change={pc} property={pc.property} />
          </div>
        );
      })}
    </div>
  );
};

export default PropertyChangesList;
