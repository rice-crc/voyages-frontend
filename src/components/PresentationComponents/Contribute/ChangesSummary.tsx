import {
    Button,
    Typography,
    Row,
    Timeline
} from 'antd';
import {
    ReloadOutlined,
    SaveOutlined,
    EditOutlined,
    PlusOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import { EntityChange, MaterializedEntity } from '@dotproductdev/voyages-contribute';
import PropertyChangesList from './PropertyChangesList';
const { Text } = Typography;

const iconMap = {
    update: <EditOutlined style={{ color: '#1890ff' }} />,
    undelete: <PlusOutlined style={{ color: '#52c41a' }} />,
    delete: <DeleteOutlined style={{ color: '#f5222d' }} />,
};

interface ChangesSummaryProps {
    changes: EntityChange[];
    entity: MaterializedEntity;
    resetAllChanges: () => void;
    submitChanges: () => void;
    handleSaveChanges: () => void;
}

const ChangesSummary = ({
    changes,entity,
    resetAllChanges,
    submitChanges,
    handleSaveChanges,
}: ChangesSummaryProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {changes.length === 0 ? (
                    <Text type="secondary" italic>
                        No changes have been made yet
                    </Text>
                ) : (
                    <Timeline
                        mode="left"
                        items={changes.map((change, index) => ({
                            key: index,
                            color: 'blue',
                            dot: iconMap[change.type],
                            children: (
                                <div style={{ marginTop: 10, marginBottom: 10 }}>
                                    <div style={{ marginBottom: 8 }}>
                                        <Text strong style={{ color: 'rgb(55, 148, 141)' }}>
                                            {change.type.toUpperCase()} @{' '}
                                            <Text type="secondary">
                                                {change.entityRef.schema}#{change.entityRef.id}
                                            </Text>
                                        </Text>
                                    </div>
                                    {change.type === 'update' ? (
                                        <PropertyChangesList changes={change.changes} entity={entity}/>
                                    ) : change.type === 'delete' ? (
                                        <div>Delete</div>
                                    ) : (
                                        <div>Un Delete</div>
                                    )}
                                </div>
                            ),
                        }))}
                    />
                )}
            </div>
        </div>
    );
};

export default ChangesSummary;

