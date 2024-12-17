import { EntitySchema, Location } from '@/models/entities';
import { IconButton } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { Box } from '@mui/system';
import '@/style/newVoyages.scss';
import { Form, Input, Select, TreeSelect } from 'antd';
import CommentBox from './CommentBox';
import { TreeItemProps } from '@mui/lab';

export interface EntityFormProps {
    schema: EntitySchema;
    visibleCommentField: string | null;
    toggleCommentBox: (field: string) => void;
    handleCommentChange: (field: string, value: string) => void;
}

export const EntityForm = ({
    schema,
    toggleCommentBox,
    handleCommentChange,
    visibleCommentField,
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

    const filterTreeNode = (inputValue: string, treeNode: TreeItemProps) => {
        return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
    };

    return schema.properties.map((p) => {
        const backingField = 'backingField' in p ? p.backingField : undefined;

        return (
            <Form.Item
                key={p.uid}
                label={<span className="form-contribute-label">{p.label}:</span>}
                name={backingField}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
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
                                treeData={treeData} // will need to change to be the correct one
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
                                options={[ // This is mock data
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

                    <CommentBox
                        value={`comment-${backingField}`}
                        isVisible={visibleCommentField === backingField}
                        onChange={(value) => handleCommentChange(backingField!, value)}
                    />
                </Box>
            </Form.Item>
        );
    });
};
