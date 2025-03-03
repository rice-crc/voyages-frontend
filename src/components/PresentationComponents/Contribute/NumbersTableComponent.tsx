import { EntityChange, TableChange } from '@/models/changeSets';
import { MaterializedEntity } from '@/models/materialization';
import { TableProperty } from '@/models/properties';
import { Input } from '@/styleMUI';
import React, { useCallback, useState } from 'react';
import { EntityPropertyChangeCommentBox } from './EntityPropertyChangeCommentBox';

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
  console.log('NumbersTableComponent', property, entity);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const entityData = entity.data;
  const handleCellChange = useCallback(
    (col: number, row: number, changed: string) => {
      const field = property.cellField(col, row);
      if (!field) return; // Skip if no backing field exists

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
      const value = entityData[field];
      // We're assuming all values are numbers as per the requirements
      if (typeof value !== 'number') return '';
      return value.toString();
    },
    [property, entityData],
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
    <>
      <div className="w-full overflow-auto">
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-2 border-b border-r sticky left-0 bg-gray-100"></th>
                {property.columns.map((header, index) => (
                  <th
                    key={header}
                    className="p-2 border-b border-r min-w-[100px] text-left"
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
                    className="p-2 border-r sticky left-0 bg-white text-left"
                    style={
                      activeCell?.rowIndex === rowIndex ? { color: 'blue' } : {}
                    }
                  >
                    {rowHeader}
                  </th>
                  {property.columns.map((_, colIndex) => {
                    const field = property.cellField(colIndex, rowIndex);
                    return (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        className="p-2 border-r border-b"
                      >
                        {field ? (
                          <Input
                            type="text"
                            value={getCellValue(colIndex, rowIndex)}
                            onChange={(e) =>
                              handleCellChange(
                                colIndex,
                                rowIndex,
                                e.target.value,
                              )
                            }
                            onBlur={() => setActiveCell(null)}
                            onFocus={() =>
                              setActiveCell({ rowIndex, colIndex })
                            }
                            className="w-full border-0 p-0 focus-visible:ring-0"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-50"></div>
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
      <div>
        <span>TODO: Check why comment button is not showing...</span>
        <EntityPropertyChangeCommentBox
          property={property}
          current={lastChange?.comments}
          onComment={handleComment}
        />
      </div>
    </>
  );
};

export default NumbersTableComponent;
