import { Table } from 'antd';
import { PropertyChange } from '@dotproductdev/voyages-contribute';
import { ReactNode } from 'react';
import PropertyChangeCard from './PropertyChangeCard';
interface PropertyChangesTableProps {
  change: PropertyChange[];
  sectionName?: string;
  showTitle?: boolean;
}

const PropertyChangesTable = ({
  change,
  sectionName,
  showTitle = true,
}: PropertyChangesTableProps) => {
  const columns = [
    {
      title: 'Field',
      dataIndex: 'property',
      key: 'property',
      with: 300,
      flex: 1,
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 250,
      flex: 1,
      render: (value: ReactNode) => {
        console.log({value})
        return (
          <div>
            {value} 
          {/* 
          // Todo: Undo here is going to be very complicated, what we can do "easily" is "pop" the last change out, if that is your undo, then you can implement it.
              <Button
                 type="text"
             icon={<UndoOutlined />}
            //  onClick={() => {
            //    console.log({change: change})
            //    change.type === 'update' ? (
            //        change.changes?.forEach((fieldChange) =>{
            //            console.log({fieldChange})
            //            // handleFieldChange(change.entityRef.schema, fieldChange.field, fieldChange.oldValue)
            //        })
            //    ) : null
            //  }}
             title="Undo changes"
           />  */}
        </div>
        )
    },
    },
  ];
  
  const dataSource = change.map((c, index) => ({
    key: index,
    property: c.property,
    value: <PropertyChangeCard change={c} property={c.property} />
  }));
  
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
          ? () => <strong className='section-title'>{sectionName.replace(/_/g, ' ')}</strong>
          : undefined
      }
    />
  );
};

export default PropertyChangesTable;
