import { Button, List, Badge, Typography, Row, Card } from 'antd';
import { ReloadOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import {
  PropertyChange,
} from '@/models/changeSets';

import { PropertyChangeCard } from './PropertyChangeCard'

interface PropertyChangesListProps {
  changes: PropertyChange[];
  handleFieldChange: (section: string, fieldName: string, previousValue: any) => void;
}

export const PropertyChangesList = ({ changes, handleFieldChange }: PropertyChangesListProps) => {
  return (
    <ul>
      {changes.map((pc, idxPC) => {
        console.log({pc: pc})
        return (
          <li key={idxPC}>
            <PropertyChangeCard change={pc} />
            <Button
              type="text"
              icon={<UndoOutlined />}
              onClick={() => {
                // console.log({change: change})
                // change.type === 'update' ? (
                //     change.changes?.forEach((fieldChange) =>{
                //         console.log({fieldChange})
                //         // handleFieldChange(change.entityRef.schema, fieldChange.field, fieldChange.oldValue)
                //     })
                // ) : null
              }}
              title="Undo changes"
            />
          </li>
        )
      })}
    </ul>
  );
};
