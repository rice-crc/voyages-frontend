import { EntitySchema, Location } from '@/models/entities';
import { IconButton } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { Box } from '@mui/system';
import '@/style/newVoyages.scss';
import { Form, Input, Select, TreeSelect } from 'antd';
import CommentBox from './CommentBox';
import { TreeItemProps } from '@mui/lab';
import { useEffect, useRef, useState } from 'react';

export interface EntityFormProps {
  schema: EntitySchema;
  handleCommentChange: (field: string, value: string) => void;
}

export const EntityForm = ({
  schema,
  handleCommentChange,
}: EntityFormProps) => {
  // Mock Tree Select
  const treeData = [
    {
      title: 'Brazil',
      value: 'brazil',
      children: [
        {
          title: 'Amazonia',
          value: 'amazonia',
          children: [
            {
              title: 'Portos do Norte',
              value: 'portos-do-norte',
            },
          ],
        },
      ],
    },
    {
      title: 'Africa',
      value: 'africa',
      children: [
        {
          title: 'Senegambia and offshore Atlantic',
          value: 'senegambia',
          children: [
            { title: 'Albreda', value: 'albreda' },
            { title: 'Arguim', value: 'arguim' },
            { title: 'Bissagos', value: 'bissagos' },
            { title: 'Bissau', value: 'bissau' },
            { title: 'Cacheu', value: 'cacheu' },
          ],
        },
      ],
    },
  ];
  const [visibleCommentField, setVisibleCommentField] = useState<string | null>(
    null
  );

  const [localComments, setLocalComments] = useState<{ [key: string]: string }>({});
  const toggleCommentBox = (field: string) => {
    setVisibleCommentField(visibleCommentField === field ? null : field);
  };

  const commentBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commentBoxRef.current && !commentBoxRef.current.contains(event.target as Node)) {
        setVisibleCommentField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterTreeNode = (inputValue: string, treeNode: TreeItemProps) => {
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  };

  const handleLocalChange = (field: string, value: string) => {
    setLocalComments((prevComments) => ({
      ...prevComments,
      [field!]: value
    }));
    handleCommentChange(field!, value);
  };

  return schema.properties.map((p) => {
    const backingField = 'backingField' in p ? p.backingField : undefined;

    return (
      <Box key={p.uid} sx={{ marginBottom: 2 }}>
        {/* Main Input Field */}
        <Form.Item
          label={<span className="form-contribute-label">{p.label}:</span>}
          name={backingField}
          style={{ marginBottom: 0 }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            {p.kind === 'text' || p.kind === 'number' ? (
              <Input
                type={p.kind}
                placeholder={`Please type ${p.label}`}
                style={{ width: 'calc(100% - 20px)' }}
              />
            ) : p.kind === 'entityValue' ? (
              p.linkedEntitySchema === Location.name ? (
                <TreeSelect
                  placeholder={`Please select ${p.label}`}
                  treeData={treeData}
                  style={{ width: 'calc(100% - 20px)' }}
                  dropdownStyle={{ overflow: 'auto', zIndex: 1301 }}
                  showSearch
                  treeCheckable
                  allowClear
                  multiple
                  treeDefaultExpandAll={false}
                  maxTagCount={8}
                  filterTreeNode={filterTreeNode}
                />
              ) : (
                <Select
                  placeholder={`Please select ${p.label}`}
                  style={{ width: 'calc(100% - 20px)' }}
                  options={[
                    // Mock data
                    { label: 'Argentina', value: 'Argentina' },
                    { label: 'Denmark', value: 'Denmark' },
                    { label: 'U.S.A.', value: 'usa' },
                  ]}
                />
              )
            ) : null}
            <IconButton
              onClick={() => toggleCommentBox(backingField!)}
              sx={{
                position: 'absolute',
                right: '-15px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              aria-label="add comment"
            >
              <CommentIcon />
            </IconButton>
          </Box>
        </Form.Item>
        <Form.Item name={'comments'} style={{ marginTop: -50 }}>
          <CommentBox
            isVisible={visibleCommentField === backingField}
            fieldKey={backingField!}
            comments={localComments}
            onChange={(value) => handleLocalChange(backingField!, value)}
            ref={commentBoxRef}
          />
        </Form.Item>
      </Box>
    );
  });
};
