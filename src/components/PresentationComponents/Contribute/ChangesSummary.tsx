import React from 'react';
import { Button, List, Typography, Row,Badge, Card } from 'antd';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { EntityChange } from '@/models/changeSets';
import { PropertyChangesList } from "./PropertyChangesList";
import '@/style/contributeContent.scss';
const { Text } = Typography;

interface ChangesSummaryProps {
  changes: EntityChange[];
  resetAllChanges: () => void;
  submitChanges: () => void;
  handleSaveChanges: ()=> void
 
}

export const ChangesSummary = ({ changes, resetAllChanges, submitChanges,handleSaveChanges }: ChangesSummaryProps) => {
    console.log({changes})
        // Function to handle field change - now properly updates the changeSet
        const handleFieldChange = (section: string, field: string, previousValue: any) => {
            // Create a new change to revert to the previous value
            // const revertChange: EntityChange = {
            //   type: 'update',
            //   entityRef: entity.entityRef,
            //   changes: [{
            //     field: field,
            //     oldValue: undefined, // This would need to be determined based on the current state
            //     newValue: previousValue
            //   }]
            // };
            
            // onChangesUpdate(revertChange);
          };
  return (

        <Card style={{ position: 'sticky', top: '1rem' }}>
          <div style={{marginBottom: '16px' }}>
            <Row>
            <Text strong style={{color: 'rgb(55, 148, 141)',  fontSize: '1.25rem',fontWeight: 700,marginBottom: '16px' }}>Changes Summary</Text>
            </Row>
           <Row>
           <div style={{ display: 'flex', gap: '8px' }}>
              <Button icon={<ReloadOutlined />} onClick={resetAllChanges} disabled={changes.length === 0}>
                Reset All
              </Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveChanges} disabled={changes.length === 0}>
                Save Changes
              </Button>
            
            </div>
           </Row>
         
          </div>

      
          {/* Changes List */}
          <div style={{ maxHeight: '60rem', overflowY: 'auto', padding: '8px', background: '#fafafa', borderRadius: '4px' }}>
            {changes.length === 0 ? (
              <Text type="secondary" italic>No changes have been made yet</Text>
            ) : (
                <>
                    <Badge
              count={changes.length || 0}
              style={{ backgroundColor: '#52c41a', marginLeft: '8px' }}
            />
             <List
                dataSource={changes}
                renderItem={(change, index) => {
                    const details =
                    change.type === 'update' ? (
                      <PropertyChangesList changes={change.changes} handleFieldChange={handleFieldChange}/>
                    ) : null;
                  return (
                    <List.Item key={index}>
                        <Text >
                          {change.type} @ {change.entityRef.schema}#{change.entityRef.id}
                          {details}
                        </Text>
                    </List.Item>
                  );
                }}
              />
                </>
             
            )}
          </div>
          <Row style={{display:'flex', textAlign: 'center', paddingTop:12, justifyContent:'center'}}>  
            <Button type="primary" icon={<SaveOutlined />} onClick={submitChanges} disabled={changes.length === 0}>
                Submit Changes
              </Button>
              </Row>
        
        </Card>
  );
};

