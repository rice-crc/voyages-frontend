import {
  EntityChange,
  TableChange,
  MaterializedEntity,
  TableProperty,
} from '@dotproductdev/voyages-contribute';
import { Input } from '@/styleMUI';
import React, { useCallback, useState } from 'react';
import { EntityPropertyChangeCommentBox } from './EntityPropertyChangeCommentBox';
import '@/style/numberTable.scss';

interface EditableTableProps {
  property: TableProperty;
  entity: MaterializedEntity;
  lastChange?: TableChange;
  onChange: (change: EntityChange) => void;
}

interface ActiveCell {
  rowIndex: number;
  colIndex: number;
}

const NumbersTableComponent: React.FC<EditableTableProps> = ({
  property,
  entity,
  lastChange,
  onChange,
}) => {
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const entityData = entity.data;

  const handleCellChange = useCallback(
    (col: number, row: number, changed: string) => {
      const field = property.cellField(col, row);
      if (!field) return;

      const numValue = changed === '' ? null : parseFloat(changed);
      if (changed !== '' && isNaN(numValue as number)) return;

      const allChanges = { ...lastChange?.changes, [field]: numValue };
      onChange({
        type: 'update',
        entityRef: entity.entityRef,
        changes: [
          {
            kind: 'table',
            property: property.uid,
            changes: allChanges,
            comments: lastChange?.comments,
          },
        ],
      });
    },
    [property, entity, entityData, lastChange, onChange],
  );

  const getCellValue = useCallback(
    (col: number, row: number): string => {
      const field = property.cellField(col, row);
      if (!field) return '';
      const changed = lastChange?.changes[field];
      const value = changed === undefined ? entityData[field] : changed;
      if (typeof value !== 'number') return '';
      return value.toString();
    },
    [property, lastChange, entityData],
  );

  const handleComment = useCallback(
    (comment: string) => {
      onChange({
        type: 'update',
        entityRef: entity.entityRef,
        changes: [
          {
            kind: 'table',
            property: property.uid,
            changes: lastChange?.changes ?? {},
            comments: comment,
          },
        ],
      });
    },
    [entity, lastChange, property, onChange],
  );

  return (
    <div className="table-wrapper">
      <div className="flex-row">
        <div className="table-section">
          <div className="table-container">
            <table className="numbers-table">
              <thead>
                <tr>
                  <th className="row-header"></th>
                  {property.columns.map((header, index) => (
                    <th
                      key={header}
                      style={
                        activeCell?.colIndex === index ? { color: 'blue' } : {}
                      }
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {property.rows.map((rowHeader, rowIndex) => (
                  <tr key={rowHeader}>
                    <th
                      className="row-header"
                      style={
                        activeCell?.rowIndex === rowIndex
                          ? { color: 'blue' }
                          : {}
                      }
                    >
                      {rowHeader}
                    </th>
                    {property.columns.map((_, colIndex) => {
                      const field = property.cellField(colIndex, rowIndex);
                      return (
                        <td key={`${rowIndex}-${colIndex}`}>
                          {field ? (
                            <Input
                              type="text"
                              value={getCellValue(colIndex, rowIndex)}
                              onChange={(e) =>
                                handleCellChange(
                                  colIndex,
                                  rowIndex,
                                  e.target.value
                                )
                              }
                              onBlur={() => setActiveCell(null)}
                              onFocus={() =>
                                setActiveCell({ rowIndex, colIndex })
                              }
                              style={{
                                width: '100%',
                                border: 'none',
                                padding: 0,
                                outline: 'none',
                                background: 'transparent',
                              }}
                            />
                          ) : (
                            <div style={{ backgroundColor: '#f9f9f9' }} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="comment-sidebar">
          <EntityPropertyChangeCommentBox
            property={property}
            current={lastChange?.comments}
            onComment={handleComment}
          />
        </div>
      </div>
    </div>
  );
};

export default NumbersTableComponent;
