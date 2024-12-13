import { EntitySchema, Location } from "@/models/entities"
import { IconButton } from "@mui/material"
import CommentIcon from "@mui/icons-material/Comment";
import { Box } from "@mui/system"
import "@/style/newVoyages.scss";
import { Form, Input, Select, TreeSelect } from "antd"
import CommentBox from "./CommentBox";
import { TreeItemProps } from "@mui/lab";


export interface EntityFormProps {
    schema: EntitySchema
    visibleCommentField: string | null
    toggleCommentBox: (field: string) => void
    handleCommentChange: (field: string, value: string) => void
}

export const EntityForm = ({ schema, toggleCommentBox, handleCommentChange, visibleCommentField }: EntityFormProps) => {
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

    return schema.properties.map(p => {
        if (p.kind === 'text' || p.kind === 'number') {
            return (
                <Form.Item key={p.uid} label={<span className="form-contribute-label">{p.label}:</span>} className="form-contribute" name="nameOfVessel">
                    <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                        <Input
                            type={p.kind}
                            placeholder={`Please type ${p.label}`}
                            style={{ width: 'calc(100% - 20px)' }}
                        />
                        <IconButton
                            onClick={() => toggleCommentBox('nameOfVessel')}
                            sx={{
                                position: "absolute",
                                right: "-15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                            aria-label="add comment"
                        >
                            <CommentIcon />
                        </IconButton>
                        <CommentBox
                            isVisible={visibleCommentField === "name"}
                            // value={comments["vesselType"] || ""}
                            onChange={(value) => handleCommentChange("vesselType", value)}
                        />
                    </Box>
                </Form.Item>
            )
        } else if (p.kind === 'entityValue') {// Selection option, Geo Tree

            if (p.linkedEntitySchema === Location.name) {
                // Render tree data list --> Geo Tree
                return (
                    <Form.Item key={p.uid} label={<span className="form-contribute-label">{p.label}:</span>} className="form-contribute">
                        <TreeSelect
                            placeholder={`Please selected ${p.label}`}
                            // value={shipData.constructionPlace || undefined}
                            // onChange={(value, label, extra) => handleInputChange("constructionPlace", value, extra)}
                            treeData={treeData}
                            style={{ width: 'calc(100% - 20px)' }}
                            dropdownStyle={{ overflow: 'auto', zIndex: 1301 }}
                            showSearch
                            treeCheckable={true}
                            allowClear
                            multiple
                            treeDefaultExpandAll={false}
                            maxTagCount={8}
                            filterTreeNode={filterTreeNode}
                        />
                        <IconButton
                            // onClick={() => toggleCommentBox("constructionPlace")}
                            sx={{
                                position: "absolute",
                                right: "-15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                            aria-label="add comment"
                        >
                            <CommentIcon />
                        </IconButton>
                        <CommentBox
                        // isVisible={visibleCommentField === "constructionPlace"}
                        // value={comments["constructionPlace"] || ""}
                        // onChange={(value) => handleCommentChange("constructionPlace", value)}
                        />
                    </Form.Item>
                )
            }
            return (
                <Form.Item key={p.uid} label={<span className="form-contribute-label">{p.label}:</span>} className="form-contribute" >
                    <Select
                        placeholder={`Please select ${p.label}`}
                        // value={p.backingField || undefined}
                        style={{ width: 'calc(100% - 20px)' }}
                        // onChange={(value) => setShipData({ ...shipData, nationalCarrier: value })}
                        options={[
                            {
                                label: <span>{p.label}</span>,
                                title: p.label,
                                options: [
                                    { label: <span>Argentinad</span>, value: 'Argentina' },
                                    { label: <span>Denmark</span>, value: 'Denmark' },
                                    { label: <span>U.S.A.</span>, value: 'usa' },
                                ],
                            },

                        ]}
                    />
                    <IconButton
                        // onClick={() => toggleCommentBox("nationalCarrier")}
                        sx={{
                            position: "absolute",
                            right: "-15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                        aria-label="add comment"
                    >
                        <CommentIcon />
                    </IconButton>
                    <CommentBox />
                </Form.Item>

            )
        }
        return null;
    })
}