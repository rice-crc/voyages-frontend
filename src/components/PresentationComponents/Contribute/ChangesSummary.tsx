import React from 'react';
import { Button, List, Badge, Tooltip, Typography, Row, Col, Card } from 'antd';
import { ReloadOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { EntityChange } from '@/models/changeSets';
import { PropertyChangesList } from "./PropertyChangesList";

const { Text } = Typography;

interface ChangesSummaryProps {
  changes: EntityChange[];
  resetAllChanges: () => void;
  submitChanges: () => void;
  handleSaveChanges: ()=> void
  handleFieldChange: (section: string, fieldName: string, previousValue: any) => void;
}

export const ChangesSummary = ({ changes, resetAllChanges, submitChanges, handleFieldChange,handleSaveChanges }: ChangesSummaryProps) => {
    console.log({changes})
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
              <List
                dataSource={changes}
                renderItem={(change, index) => {
                    const details =
                    change.type === 'update' ? (
                      <PropertyChangesList changes={change.changes} />
                    ) : null;
                  return (
                    <List.Item key={index}>
                      <div>
                        <Text strong>
                          {change.type} @ {change.entityRef.schema}#{change.entityRef.id}
                          {details}
                        </Text>
                        <Badge
                          count={changes.length || 0}
                          style={{ backgroundColor: '#52c41a', marginLeft: '8px' }}
                        />
                      </div>
                      <Button
                        type="text"
                        icon={<UndoOutlined />}
                        onClick={() =>{
                            console.log({change: change.type})
                            change.type === 'update' ? (
                                change.changes?.forEach((fieldChange) =>{
                                    console.log({fieldChange})
                                    // handleFieldChange(change.entityRef.schema, fieldChange.field, fieldChange.oldValue)
                                })
                            ) : null
                        }
                          
                        }
                        title="Undo changes"
                      />
                    </List.Item>
                  );
                }}
              />
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

