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
import React, { useCallback, useEffect, useState } from 'react';
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
  const schema = getSchema(entity.entityRef.schema);
  const [changeSet, setChangeSet] = useState<ChangeSet>({
    id: -1,
    author: 'Mocked',
    title: `Contribution for ${schema.getLabel(entity.data)}`,
    changes: [],
    comments: '',
    timestamp: new Date().getDate(),
  });

  const [accessLevel, setAccessLevel] = useState<PropertyAccessLevel>(
    PropertyAccessLevel.AdvancedContributor,
  );
  const [globalExpand, setGlobalExpand] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string[]>([]);
  const [sections, setSections] = useState<CollapseProps['items']>([]);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const translatedcontribute = translationLanguagesContribute(languageValue);

  const accessLevelOptions = Object.entries(PropertyAccessLevel)
    .filter(([key]) => isNaN(Number(key)) && key !== 'Hidden')
    .map(([label, value]) => ({
      label: label.replace(/([A-Z])/g, ' $1').trim(),
      value,
    }));

  useEffect(() => {
    setChangeSet({
      id: -1,
      author: 'Mocked',
      title: `Contribution for ${schema.getLabel(entity.data)}`,
      changes: [],
      comments: '',
      timestamp: new Date().getDate(),
    });
  }, [schema, entity]);

  const onChangesUpdate = useCallback(
    (c: EntityChange) =>
      setChangeSet((current) => {
        const next = addToChangeSet(current.changes, c);
        dropOrphans(next);
        return { ...current, changes: next };
      }),
    [],
  );

  const toggleExpandAll = () => {
    const allKeys = sections?.map((section) => section.key as string) ?? [];
    setExpandedMenu(globalExpand ? [] : allKeys);
    setGlobalExpand(!globalExpand);
  };

  const handlePreviewChanges = () => {
    const combined = combineChanges(changeSet.changes);
    console.log('Flattened change set:', combined);
    const updated = cloneEntity(entity);
    applyChanges(expandMaterialized(updated), changeSet.changes);
    console.log('Entity after changes:', updated);
  };

  const resetAllChanges = () => {
    Modal.confirm({
      title: 'Reset all changes?',
      content: 'This will clear all unsaved edits. Are you sure?',
      onOk: () => setChangeSet((current) => ({ ...current, changes: [] })),
    });
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', changeSet);
    alert('Changes saved successfully!');
    resetAllChanges();
  };

  const submitChanges = () => {
    console.log('Submitting changes:', changeSet);
    alert('Changes submitted!');
    resetAllChanges();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: `${height}vh`,
      }}
    >
      <Card
        title="Contribution Details"
        style={{ flexShrink: 0 }}
        styles={{
          body: {
            paddingTop: 12,
            paddingBottom: 0,
          },
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Contribution Title">
              <Input
                value={changeSet.title}
                onChange={(e) =>
                  setChangeSet({ ...changeSet, title: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Contribution Message">
              <Input.TextArea
                rows={4}
                value={changeSet.comments}
                onChange={(e) =>
                  setChangeSet({ ...changeSet, comments: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Contributor Mode">
              <Select
                value={accessLevel}
                onChange={(value: PropertyAccessLevel) => setAccessLevel(value)}
                options={accessLevelOptions}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
              <Form.Item label=" " colon={false} style={{ width: 200 }}>
                <Button danger block onClick={handlePreviewChanges}>
                  Preview Changes
                </Button>
              </Form.Item>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          gap: '12px',
          padding: '12px 0',
        }}
      >
        {/* Left Panel */}
        <Col
          span={12}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
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
                padding: 0,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              },
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 99,
                background: '#fff',
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Text strong>{translatedcontribute.titleCollaps}</Text>
              <a onClick={toggleExpandAll} style={{ marginLeft: 12 }}>
                {globalExpand
                  ? translatedcontribute.collapse
                  : translatedcontribute.expand}
              </a>
            </div>
            <div style={{ overflowY: 'auto', padding: 16, flex: 1 }}>
              <EntityForm
                key={entity.entityRef.id}
                schema={schema}
                entity={entity}
                changes={changeSet.changes}
                onChange={onChangesUpdate}
                setExpandedMenu={setExpandedMenu}
                expandedMenu={expandedMenu}
                accessLevel={accessLevel}
                onSectionsChange={setSections}
              />
            </div>
          </Card>
        </Col>

        {/* Right Panel */}
        <Col
          span={12}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
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
                padding: 0,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              },
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 99,
                background: '#fff',
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text strong>Changes Summary</Text>
              <Text type="secondary">
                {changeSet.changes.length} change
                {changeSet.changes.length !== 1 && 's'}
              </Text>
            </div>
            <div style={{ overflowY: 'auto', padding: 16, flex: 1 }}>
              <ChangesSummary
                changes={changeSet.changes}
                resetAllChanges={resetAllChanges}
                submitChanges={submitChanges}
                handleSaveChanges={handleSaveChanges}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
