import React from 'react';
import {
  Button,
  Typography,
  Row,
  Card,
  Timeline,
  Badge,
} from 'antd';
import {
  ReloadOutlined,
  SaveOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { EntityChange } from '@/models/changeSets';
import { PropertyChangesList } from './PropertyChangesList';

const { Text } = Typography;

const iconMap = {
  update: <EditOutlined style={{ color: '#1890ff' }} />,
  undelete: <PlusOutlined style={{ color: '#52c41a' }} />,
  delete: <DeleteOutlined style={{ color: '#f5222d' }} />,
};

interface ChangesSummaryProps {
  changes: EntityChange[];
  resetAllChanges: () => void;
  submitChanges: () => void;
  handleSaveChanges: () => void;
}

export const ChangesSummary = ({
  changes,
  resetAllChanges,
  submitChanges,
  handleSaveChanges,
}: ChangesSummaryProps) => {
  return (
    <Card
      style={{
        position: 'sticky',
        top: '1rem',
        maxHeight: '95vh',
        overflowY: 'auto',
        padding: 16,
        border: '1px solid #f0f0f0',
      }}
      bodyStyle={{ padding: '0 16px 16px 16px' }}
    >
 <Text strong style={{color: 'rgb(55, 148, 141)',  fontSize: '1.25rem',fontWeight: 700,marginBottom: '16px' }}>Changes Summary</Text>
      <Row style={{ margin: '12px 0', gap: 8 }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={resetAllChanges}
          disabled={changes.length === 0}
        >
          Reset All
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveChanges}
          disabled={changes.length === 0}
        >
          Save Changes
        </Button>
      </Row>

      <div style={{ marginTop: 16 }}>
        {changes.length === 0 ? (
          <Text type="secondary" italic>
            No changes have been made yet
          </Text>
        ) : (
          <>
            {/* <Badge
              count={changes.length}
              style={{ backgroundColor: '#52c41a', marginBottom: 16 }}
            /> */}
          <Card size="small" bordered={false} style={{ background: '#f6f8fa', padding:'10px 6px'}}>
            <Timeline mode="left">
              {changes.map((change, index) => {
                console.log({change})
                return (
                    <Timeline.Item
                      key={index}
                      dot={iconMap[change.type]}
                      color="blue"
                    >
                   
                        <Text strong style={{ display: 'block', marginBottom: 4,color: 'rgb(55, 148, 141)',  fontSize: '1rem', fontWeight: 600  }}>
                          {change.type.toUpperCase()} &nbsp; @{' '}
                          <Text type="secondary" className='property-change'>
                            {change.entityRef.schema}#{change.entityRef.id}
                          </Text>
                        </Text>
                        {change.type === 'update' ? (
                            <PropertyChangesList
                          changes={change.changes}
                          handleFieldChange={() => {}}
                        />): null}
                   
                    </Timeline.Item>
                  )
              } )}
            </Timeline>   
            </Card>
          </>
        )}
      </div>
      {changes.length > 0 && (
        <Row style={{ justifyContent: 'center', paddingTop: 12 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={submitChanges}
            disabled={changes.length === 0}
          >
            Submit Changes
          </Button>
        </Row>
      )}
    </Card>
  );
};
