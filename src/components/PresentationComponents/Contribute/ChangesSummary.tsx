import {
  ReloadOutlined,
  SaveOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Typography, Row, Timeline } from 'antd';

import { EntityChange } from '@/models/changeSets';

import PropertyChangesList from './PropertyChangesList';
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

const ChangesSummary = ({
  changes,
  resetAllChanges,
  submitChanges,
  handleSaveChanges,
}: ChangesSummaryProps) => {
  return (
    <div>
      <Row style={{ margin: '12px 0', gap: 8 }}>
        <Button
          className="button-reset-contribute"
          icon={<ReloadOutlined />}
          onClick={resetAllChanges}
          disabled={changes.length === 0}
        >
          Reset All
        </Button>
        <Button
          className="button-save-contribute"
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
          <Timeline mode="left">
            {changes.map((change, index) => {
              return (
                <Timeline.Item
                  key={index}
                  dot={iconMap[change.type]}
                  color="blue"
                >
                  <Text strong style={{ color: 'rgb(55, 148, 141)' }}>
                    {change.type.toUpperCase()} @{' '}
                    <Text type="secondary">
                      {change.entityRef.schema}#{change.entityRef.id}
                    </Text>
                  </Text>
                  <div style={{ marginTop: 10, marginBottom: 10 }}>
                    {change.type === 'update' ? (
                      <PropertyChangesList changes={change.changes} />
                    ) : change.type === 'delete' ? (
                      <div>Delete</div>
                    ) : (
                      <div>Un Delete</div>
                    )}
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </div>

      {changes.length > 0 && (
        <Row style={{ justifyContent: 'center', paddingTop: 12 }}>
          <Button
            icon={<SaveOutlined />}
            className="button-submit-contribute"
            onClick={submitChanges}
            disabled={changes.length === 0}
          >
            Submit Changes
          </Button>
        </Row>
      )}
    </div>
  );
};

export default ChangesSummary;
