import React, { useCallback, useState } from 'react';
import { Table, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EntityChange,
  TableChange,
  MaterializedEntity,
  TableProperty,
} from '@dotproductdev/voyages-contribute';
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
  const [localChanges, setLocalChanges] = useState<Record<string, string>>({});

  const entityData = entity.data;

  const handleCellChange = useCallback(
    (col: number, row: number, changed: string) => {
      const field = property.cellField(col, row);
      if (!field) return;

      const numValue = changed === '' ? null : parseFloat(changed);
      if (changed !== '' && isNaN(numValue as number)) return;

      setLocalChanges((prev) => ({
        ...prev,
        [field]: changed,
      }));

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
    [property, entity, lastChange, onChange]
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
    [property, lastChange, entityData]
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
    [entity, lastChange, property, onChange]
  );


  // Construct dataSource for Antd Table
  const dataSource = property.rows.map((rowHeader, rowIndex) => {
    const row: any = {
      key: rowIndex,
      rowHeader,
    };
    property.columns.forEach((_, colIndex) => {
      const field = property.cellField(colIndex, rowIndex);
      row[`col-${colIndex}`] = {
        field,
        value: getCellValue(colIndex, rowIndex),
        rowIndex,
        colIndex,
      };
    });
    return row;
  });

  // Construct columns for Antd Table
  const columns: ColumnsType<any> = [
    {
      title: '',
      dataIndex: 'rowHeader',
      key: 'rowHeader',
      fixed: 'left',
      width: 210,
      render: (text: string, _record, rowIndex) => (
        <span
          style={
            activeCell?.rowIndex === rowIndex
              ? { color: 'rgb(55, 148, 141)', fontSize: '0.85rem' }
              : { fontSize: '0.85rem' }
          }
        >
          {text}
        </span>
      ),
    },
    ...property.columns.map((colHeader, colIndex) => ({
      title: (
        <span
          style={
            activeCell?.colIndex === colIndex
              ? { color: 'rgb(55, 148, 141)', fontSize: '0.85rem' }
              : { fontSize: '0.85rem' }
          }
        >
          {colHeader.charAt(0).toUpperCase() + colHeader.slice(1).toLowerCase()}
        </span>
      ),
      dataIndex: `col-${colIndex}`,
      key: `col-${colIndex}`,
      width: 70,
      render: (cell: any) =>
        cell?.field ? (
          <Input
            value={localChanges[cell.field] ?? cell.value}
            onChange={(e) =>
              handleCellChange(cell.colIndex, cell.rowIndex, e.target.value)
            }
            onFocus={() =>
              setActiveCell({
                rowIndex: cell.rowIndex,
                colIndex: cell.colIndex,
              })
            }
            onBlur={() => setActiveCell(null)}
            style={{
              padding: 2,
              border: 'none',
              borderBottom: '1px solid #d9d9d9',
              borderRadius: 0,
              outline: 'none',
              boxShadow: 'none',
              background: 'transparent',
            }}
          />
        ) : (
          <div style={{ backgroundColor: '#f9f9f9' }} />
        ),
    })),
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
        size="small"
        footer={() => (
          <div className="comment-box-wrapper" >
            <EntityPropertyChangeCommentBox
              property={property}
              current={lastChange?.comments}
              onComment={handleComment}
            />
          </div>
        )}
      />
    </div>
  )
};

export default NumbersTableComponent;
