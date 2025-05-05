import {
  Button,
  CollapseProps,
  Form,
  Row,
  Col,
  Input,
  Select,
  Card,
  Modal,
  Typography,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import {
  addToChangeSet,
  combineChanges,
  dropOrphans,
  EntityChange,
  ChangeSet,
  getSchema,
  applyChanges,
  cloneEntity,
  expandMaterialized,
  MaterializedEntity,
  PropertyAccessLevel,
  PropertyChange,
} from '@dotproductdev/voyages-contribute';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { translationLanguagesContribute } from '@/utils/functions/translationLanguages';
import { EntityForm } from './EntityForm';
import ChangesSummary from './ChangesSummary';

const { Text } = Typography;

export const ContributionForm = ({
  entity,
  height,
}: {
  entity: MaterializedEntity;
  height: number;
}) => {
  const [contributeForm] = Form.useForm();
  const schema = getSchema(entity.entityRef.schema);
  const [changeSet, setChangeSet] = useState<ChangeSet>({
    id: -1,
    author: 'Mocked',
    title: '',
    changes: [],
    comments: '',
    timestamp: new Date().getTime(),
  });
  const [accessLevel, setAccessLevel] = useState<PropertyAccessLevel>(
    PropertyAccessLevel.AdvancedContributor,
  );
  const [globalExpand, setGlobalExpand] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string[]>([]);
  const [sections, setSections] = useState<CollapseProps['items']>([]);
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  const translatedcontribute = translationLanguagesContribute(languageValue);

  const accessLevelOptions = Object.entries(PropertyAccessLevel)
    .filter(([key]) => isNaN(Number(key)) && key !== 'Hidden')
    .map(([label, value]) => ({ label: label.replace(/([A-Z])/g, ' $1').trim(), value }));

  useEffect(() => {
    contributeForm.setFieldsValue({
      title: `Contribution for ${schema.getLabel(entity.data)}`,
      comments: '',
      accessLevel: PropertyAccessLevel.AdvancedContributor,
    });
    setChangeSet({
      id: -1,
      author: 'Mocked',
      title: `Contribution for ${schema.getLabel(entity.data)}`,
      changes: [],
      comments: '',
      timestamp: new Date().getTime(),
    });
  }, [schema, entity]);

  function combineOwnedChanges(changes: PropertyChange[]): PropertyChange[] {
    const seen: Record<string, PropertyChange> = {};

    changes.forEach(change => {
      seen[change.property] = change; // overwrite old with new
    });

    return Object.values(seen);
  }

  function combineEntityChanges(changes: EntityChange[]): EntityChange[] {
    return changes.map(change => {
      if (change.type === 'update') {
        return {
          ...change,
          changes: change.changes.map(propertyChange => {
            if (propertyChange.kind === 'owned') {
              return {
                ...propertyChange,
                changes: combineOwnedChanges(propertyChange.changes),
              };
            }
            return propertyChange;
          }),
        };
      }
      return change;
    });
  }

  const onChangesUpdate = useCallback(
    (newChange: EntityChange) =>
      setChangeSet((current) => {
        const next = addToChangeSet(current.changes, newChange);
        dropOrphans(next);
        const combined = combineEntityChanges(next);
        return { ...current, changes: combined };
      }),
    [],
  );

  const handlePreviewChanges = () => {
    const formValues = contributeForm.getFieldsValue();
    console.log('Form Values:', formValues);
    console.log('ChangeSet:', changeSet);
    const combined = combineChanges(changeSet.changes);
    console.log('Flattened change set:', combined);

    const updated = cloneEntity(entity);
    applyChanges(expandMaterialized(updated), changeSet.changes);
    console.log('Entity after applying changes:', updated);
  };

  const submitChanges = async () => {
    try {
      const formValues = await contributeForm.validateFields();

      const payload = {
        title: formValues.title,
        comments: formValues.comments,
        accessLevel: formValues.accessLevel,
        timestamp: Date.now(),
        changes: changeSet.changes,
      };


      console.log('Submit Payload:', payload);

      // TODO: Call your API here
      // await yourApi.submitContribution(payload);

      alert('Changes submitted successfully!');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const resetAllChanges = () => {
    Modal.confirm({
      title: 'Reset all changes?',
      content: 'This will clear all unsaved edits. Are you sure?',
      onOk: () => {
        setChangeSet((current) => ({ ...current, changes: [] }));
        contributeForm.resetFields();
      },
    });
  };

  const toggleExpandAll = () => {
    const allKeys = sections?.map((section) => section.key as string) ?? [];
    setExpandedMenu(globalExpand ? [] : allKeys);
    setGlobalExpand(!globalExpand);
  };

  return (
    <Form
      form={contributeForm}
      layout="vertical"
      onFinish={submitChanges}
      style={{ display: 'flex', flexDirection: 'column', height: `${height}vh` }}
    >
      {/* Top Form - Contribution Details */}
      <Card title="Contribution Details" style={{ flexShrink: 0 }} styles={{body:{padding: '10px 16px'}}}>
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item label="Contribution Title" name="title">
              <Input />
            </Form.Item>
            <Form.Item label="Contribution Message" name="comments">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Contributor Mode" name="accessLevel">
              <Select options={accessLevelOptions} style={{ width: '100%' }} />
            </Form.Item>
            <Row style={{ justifyContent: 'center' }}>
              <Form.Item label=" " colon={false}>
                <Button danger block onClick={handlePreviewChanges}>
                  Preview Changes
                </Button>
              </Form.Item>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Middle Section */}
      <Row style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: '4px', padding: '12px 0' }}>
        <Col span={12} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Card style={{ flex: 1, overflow: 'hidden' }}
            styles={{
              body: {
                padding: 8,
              },
            }}>
            <div style={{ position: 'sticky', top: 0, background: '#fff', padding: 10, borderBottom: '1px solid #f0f0f0', zIndex: 99 }}>
              <Text strong>{translatedcontribute.titleCollaps}</Text>
              <a onClick={toggleExpandAll} style={{ marginLeft: 12 }}>
                {globalExpand ? translatedcontribute.collapse : translatedcontribute.expand}
              </a>
            </div>
            <div style={{ overflowY: 'auto', padding: 4, flex: 1, height: `80vh` }}>
              <EntityForm
                key={entity.entityRef.id}
                schema={schema}
                entity={entity}
                changes={changeSet.changes}
                onChange={onChangesUpdate}
                expandedMenu={expandedMenu}
                setExpandedMenu={setExpandedMenu}
                accessLevel={accessLevel}
                onSectionsChange={setSections}
              />
            </div>
          </Card>
        </Col>

        <Col
          span={12}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Card
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            styles={{
              body: {
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              },
            }}
          >
            {/* Sticky header */}
            <div style={{
              padding: 10,
              borderBottom: '1px solid #eee',
              background: '#fff',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Text strong>Changes Summary</Text>
              <Text type="secondary">{changeSet.changes.length} change{changeSet.changes.length !== 1 && 's'}</Text>
            </div>

            {/* Scrollable area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              <ChangesSummary
                changes={changeSet.changes}
                resetAllChanges={resetAllChanges}
                submitChanges={submitChanges}
                handleSaveChanges={submitChanges}
              />
            </div>

            {/* Fixed footer */}
            <div style={{
              padding: 12,
              borderTop: '1px solid #eee',
              background: '#fff',
            }}>
              <Row justify="center">
                <Button
                  style={{ width: 150 }}
                  type="primary"
                  onClick={submitChanges}
                  block
                  disabled={changeSet.changes.length === 0}
                >
                  Submit Changes
                </Button>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default ContributionForm;