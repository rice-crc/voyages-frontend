
import {
    PropertyChange,
  } from '@/models/changeSets';

import {PropertyChangeCard} from './PropertyChangeCard'

interface PropertyChangesListProps {
    changes: PropertyChange[];
  }
  
 export const PropertyChangesList = ({ changes }: PropertyChangesListProps) => {
    return (
      <ul>
        {changes.map((pc, idxPC) => (
          <li key={idxPC}>
            <PropertyChangeCard change={pc} />
          </li>
        ))}
      </ul>
    );
  };
  