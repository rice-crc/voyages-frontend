import { Table } from 'antd';
import { PropertyChange } from '@dotproductdev/voyages-contribute';
import { ReactNode, useState } from 'react';
import PropertyChangeCard from './PropertyChangeCard';
import { IconButton } from '@mui/material';
import { Delete, Restore } from '@mui/icons-material';
import { convertTextProperty } from '@/utils/functions/convertTextProperty';
interface PropertyChangesTableProps {
  change: PropertyChange[];
  handleDeleteChange: (propertyToDelete: string) => void
  sectionName?: string;
  showTitle?: boolean;
}

const PropertyChangesTable = ({
  change,
  sectionName, handleDeleteChange,
  showTitle = true,
}: PropertyChangesTableProps) => {

  const columns = [
    {
      title: 'Field',
      dataIndex: 'property',
      key: 'property',
      flex: 1,
      render: (property: string) => <div>{convertTextProperty(property)}</div>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      flex: 1,
      render: (value: ReactNode) => {
        return (
          <div>
            {value}
          </div>
        )
      }
    },
    // Todo: Undo here is going to be very complicated, what we can do "easily" is "pop" the last change out, if that is your undo, then you can implement it.
    // {
    //   title: 'Action',
    //   dataIndex: 'undo',
    //   key: 'undo',
    //   width: 50,
    //   flex: 1,
    //   render: (_: any, record: any) => {
    //     console.log({ record })
    //     return (
    //       <IconButton
    //         size="small"
    //         color={'error'}
    //         onClick={() => handleDeleteChange(record.property)}
    //         title={'Delete'}
    //       >
    //         <Delete />
    //       </IconButton>
    //     );
    //   }
    // }
  ];

  const sortedChanges = [...change].sort((a, b) =>
    a.property.localeCompare(b.property)
  );

  const seenProperties = new Set<string>();

  const dataSource = sortedChanges
    .filter((c): c is PropertyChange => !!c && typeof c.property === 'string')
    .map((c, index) => {
      const isFirstOccurrence = !seenProperties.has(c.property);
      if (isFirstOccurrence) seenProperties.add(c.property);
      const rowKey = `${c.property}-${index}`;
      return {
        key: rowKey,
        property: c.property,
        value: <PropertyChangeCard change={c} property={c.property} handleDeleteChange={handleDeleteChange} />,
      };
    });


  return (
    <Table
      size="small"
      className="property-changes-table"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      bordered
      showHeader={false}
      title={
        showTitle && sectionName
          ? () => <strong className="section-title">{sectionName.replace(/_/g, ' ')}</strong>
          : undefined
      }
    />
  );
};

export default PropertyChangesTable;
