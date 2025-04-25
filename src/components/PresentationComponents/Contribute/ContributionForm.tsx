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
}: {
  entity: MaterializedEntity;
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
    <>
      <Card title="Contribution Details" style={{ marginBottom: 24 }}>
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

      <Row gutter={24}>
        <Col span={12}>
          <Card
            title={
              <Text
                style={{
                  fontSize: '1rem',
                }}
              >
                <span>{translatedcontribute.titleCollaps}</span>
                <a
                  onClick={toggleExpandAll}
                  style={{
                    color: 'rgb(55, 148, 141)',
                    fontSize: '0.85rem',
                    marginLeft: 12,
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  {globalExpand
                    ? translatedcontribute.collapse
                    : translatedcontribute.expand}
                </a>
              </Text>
            }
            style={{ position: 'sticky', top: '1rem' }}
          >
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
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <Text
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                Changes Summary
              </Text>
            }
            extra={
              <Text
                type="secondary"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                {changeSet.changes.length} change
                {changeSet.changes.length !== 1 && 's'}
              </Text>
            }
          >
            <ChangesSummary
              changes={changeSet.changes}
              resetAllChanges={resetAllChanges}
              submitChanges={submitChanges}
              handleSaveChanges={handleSaveChanges}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

//     addToChangeSet,
//     combineChanges,
//     dropOrphans,
//     EntityChange,
//   } from '@/models/changeSets';
//   import { ChangeSet } from '@/models/contribution';
//   import { EntitySchema, getSchema } from '@/models/entities';
//   import {
//     applyChanges,
//     cloneEntity,
//     expandMaterialized,
//     MaterializedEntity,
//   } from '@/models/materialization';
//   import { PropertyAccessLevel } from '@/models/properties';
//   import { RootState } from '@/redux/store';
//   import { translationLanguagesContribute } from '@/utils/functions/translationLanguages';
//   import {
//     Button,
//     CollapseProps,
//     Form,
//     Row,Col,
//     Input,
//     Select,Card
//   } from 'antd';
//   import React, {
//     ReactNode,
//     useCallback,
//     useState,
//     useEffect,
//   } from 'react';
//   import { useSelector } from 'react-redux';
//   import { EntityForm } from './EntityForm';
//   import ChangesSummary from './ChangesSummary'

//   export interface ContributionFormProps {
//     entity: MaterializedEntity;
//     // onUpdate: (contribution: Contribution) => void;
//   }

//   export interface EntityFormProps {
//     schema: EntitySchema;
//     entity: MaterializedEntity;
//     changes: EntityChange[];
//     onChange: (change: EntityChange) => void;
//     /*
//       entity: MaterializedEntity
//       changeSet: ChangeSet
//       onUpdate: (changeSet: ChangeSet) => void
//       */
//     expandedMenu: string[];
//     setExpandedMenu: React.Dispatch<React.SetStateAction<string[]>>;
//     accessLevel: PropertyAccessLevel;
//     onSectionsChange?: (sections: CollapseProps['items']) => void;
//   }

//   const accessLevelOptions = Object.entries(PropertyAccessLevel)
//     .filter(([key]) => isNaN(Number(key)) && key !== 'Hidden') // Filter out reverse mapping
//     .map(([label, value]) => ({
//       label: label.replace(/([A-Z])/g, ' $1').trim(), // Add spaces between camel case
//       value: value,
//     }));

//   const tempCreateChangeSet = (
//     schema: EntitySchema,
//     entity: MaterializedEntity,
//   ) => ({
//     id: -1,
//     author: 'Mocked',
//     title: `Contribution for ${schema.getLabel(entity.data)}`,
//     changes: [],
//     comments: '',
//     timestamp: new Date().getDate(),
//   });

// // Inside ContributionForm.tsx
// export const ContributionForm = ({ entity }: ContributionFormProps) => {
//     const [accessLevel, setAccessLevel] = useState<PropertyAccessLevel>(
//       PropertyAccessLevel.AdvancedContributor,
//     );
//     const schema = getSchema(entity.entityRef.schema);
//     // Create changeSet with proper initialization
//     const [changeSet, setChangeSet] = useState<ChangeSet>(
//       tempCreateChangeSet(schema, entity),
//     );

//     useEffect(() => {
//       setChangeSet(tempCreateChangeSet(schema, entity));
//     }, [schema, entity]);

//     // Update changes handler that properly updates the changeSet
//     const onChangesUpdate = useCallback(
//       (c: EntityChange) =>
//         setChangeSet((current) => {
//           // Merge the change with our change set.
//           const next = addToChangeSet(current.changes, c);
//           dropOrphans(next);
//           return { ...current, changes: next };
//         }),
//       [setChangeSet],
//     );

//     const [globalExpand, setGlobalExpand] = useState(false);
//     const [expandedMenu, setExpandedMenu] = useState<string[]>([]);
//     const { languageValue } = useSelector(
//       (state: RootState) => state.getLanguages,
//     );
//     const translatedcontribute = translationLanguagesContribute(languageValue);
//     const [sections, setSections] = useState<CollapseProps['items']>([]);

//     const toggleExpandAll = () => {
//       if (globalExpand) {
//         setExpandedMenu([]);
//       } else {
//         const allSectionKeys =
//           sections?.map((section) => section.key as string) ?? [];
//         setExpandedMenu(allSectionKeys);
//       }
//       setGlobalExpand((prevState) => !prevState);
//     };

//     const handleJohnButton = useCallback(() => {
//       const combined = combineChanges(changeSet.changes);
//       console.log('Combined and flattened change set:');
//       console.dir(combined);
//       const changed = cloneEntity(entity);
//       applyChanges(expandMaterialized(changed), changeSet.changes);
//       console.log('This is the version with applied changes:');
//       console.dir(changed);
//     }, [changeSet]);

//     const [contributionTitle, setContributionTitle] = useState(`Contribution for Voyage #${entity.entityRef.id}`);
//     const [contributionMessage, setContributionMessage] = useState('');

//     // Reset all changes
//     const resetAllChanges = () => {
//       setChangeSet((current) => ({
//         ...current,
//         changes: []
//       }));
//     };

//     // Submit changes
//     const submitChanges = () => {
//       console.log('Submitting changes:', {
//         title: changeSet.title,
//         message: changeSet.comments,
//         changes: changeSet.changes
//       });
//       // Here you would send the data to your backend
//       alert('Changes submitted successfully!');
//       resetAllChanges();
//     };
//     // Save Changes
//     const handleSaveChanges = () => {
//       console.log('saveChanges changes:', {
//         title: changeSet.title,
//         message: changeSet.comments,
//         changes: changeSet.changes
//       });
//       // Here you would send the data to your backend
//       alert('Changes submitted successfully!');
//       resetAllChanges();
//     };

//     // Function to handle field change - now properly updates the changeSet
//     const handleFieldChange = (section: string, field: string, previousValue: any) => {
//       // Create a new change to revert to the previous value
//       // const revertChange: EntityChange = {
//       //   type: 'update',
//       //   entityRef: entity.entityRef,
//       //   changes: [{
//       //     field: field,
//       //     oldValue: undefined, // This would need to be determined based on the current state
//       //     newValue: previousValue
//       //   }]
//       // };

//       // onChangesUpdate(revertChange);
//     };

//     return (
//       <>
//             <Button danger onClick={handleJohnButton}>
//           John's Button
//         </Button>
//         <Row>

//           <Col  span={12}>
//           <Form.Item label="Contribution title" style={{margin: '15px 0'}}>
//           <Input
//             value={changeSet.title}
//             onChange={(e) =>
//               setChangeSet({ ...changeSet, title: e.target.value })
//             }
//           />
//         </Form.Item>
//         <Form.Item label="Contribution message">
//           <Input.TextArea
//             rows={4}
//             value={changeSet.comments}
//             onChange={(e) =>
//               setChangeSet({ ...changeSet, comments: e.target.value })
//             }
//           />
//         </Form.Item>
//           </Col>
//           <Col  span={12}>
//           <Form.Item label="Contrib mode">
//           <Select
//             value={accessLevel}
//             onChange={(value: PropertyAccessLevel) => setAccessLevel(value)}
//             options={accessLevelOptions}
//             style={{ width: 200, margin: '10px 0' }}
//           />
//         </Form.Item>
//           </Col>
//         </Row>
//         <Row gutter={24} style={{ padding: '24px' }}>
//           <Col span={12}>
//             <Card style={{ position: 'sticky', top: '1rem' }}>
//             <div className="expand-collapse">
//               {translatedcontribute.titleCollaps}{' '}
//               <a href="#" onClick={toggleExpandAll}>
//                 {!globalExpand
//                   ? translatedcontribute.expand
//                   : translatedcontribute.collapse}
//               </a>{' '}
//             </div>
//             <EntityForm
//               key={entity.entityRef.id}
//               schema={schema}
//               entity={entity}
//               changes={changeSet.changes}
//               onChange={onChangesUpdate}
//               setExpandedMenu={setExpandedMenu}
//               expandedMenu={expandedMenu}
//               accessLevel={accessLevel}
//               onSectionsChange={setSections}
//             />
//             </Card>
//           </Col>
//           <Col span={12}>
//             <ChangesSummary
//               changes={changeSet.changes}
//               resetAllChanges={resetAllChanges}
//               submitChanges={submitChanges}
//               handleSaveChanges={handleSaveChanges}
//             />
//           </Col>
//         </Row>
//       </>
//     );
//   };
