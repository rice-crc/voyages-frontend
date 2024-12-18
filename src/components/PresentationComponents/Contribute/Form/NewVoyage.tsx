import "@/style/contributeContent.scss";
import "@/style/newVoyages.scss";
import { Box, Button } from "@mui/material";
import { Collapse, Divider, Form, Input, Typography, message } from "antd";
import { useMemo, useState } from "react";
import type { CollapseProps } from "antd";
import React from "react";
import { EntityForm } from "../EntityForm";
import { VoyageShipEntitySchema, VoyageSlaveNumbersSchema, VoyageItinerarySchema, VoyageDatesSchema } from "@/models/entities";
import { EntitySchema } from "@/models/entities"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { translationLanguagesContribute } from "@/utils/functions/translationLanguages";

export interface EntityFormProps {
    schema: EntitySchema
}
const NewVoyage: React.FC = () => {
    const [form] = Form.useForm();
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);
    const translatedcontribute = translationLanguagesContribute(languageValue)

    const handleCommentChange = (field: string, value: string) => {
        setComments({
            ...comments,
            [field]: value,
        });
    };


    // Handlers for the form submission
    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // Combine form data with comments
            const submissionData = {
                ...values,
                comments, // Include comments collected from the form
            };

            console.log("Save submission data:", submissionData);

            // Simulate an API call or state update
            // Replace with your actual API integration
            const response = await saveVoyageData(submissionData);
            console.log({ response })

        } catch (error) {
            console.error("Save error:", error);
            message.error("Please correct the errors before saving.");
        }
    };

    // Mock API call function
    const saveVoyageData = async (data: any) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    };

    const handleReview = () => {
        form.validateFields()
            .then((values) => {
                console.log("Review values:", values);
                message.info("Review process started.");
            })
            .catch((error) => {
                message.error("Please correct the errors before reviewing.");
            });
    };

    const handleCancel = () => {
        form.resetFields();
        message.warning("Contribution canceled.");
    };

    const items: CollapseProps["items"] = useMemo(() => [
        {
            key: VoyageShipEntitySchema.backingModel,
            label: <Typography.Title level={4} className="collapse-title">Ship, Nation, Owners</Typography.Title>,
            children: <EntityForm schema={VoyageShipEntitySchema} handleCommentChange={handleCommentChange} />
        },
        { // Need to change to EntitySchema later
            key: "2",
            label: <Typography.Title level={4} className="collapse-title">Voyage Outcome</Typography.Title>,
            children: "VoyageOutcome",
        },
        {
            key: VoyageItinerarySchema.backingModel,
            label: <Typography.Title level={4} className="collapse-title">Voyage Itinerary</Typography.Title>,
            children: <EntityForm schema={VoyageItinerarySchema} handleCommentChange={handleCommentChange} />
        },
        {
            key: VoyageDatesSchema.backingModel,
            label: <Typography.Title level={4} className="collapse-title">Voyage Dates</Typography.Title>,
            children: <EntityForm schema={VoyageDatesSchema} handleCommentChange={handleCommentChange} />
        },
        { // Need to change to EntitySchema later
            key: "5",
            label: <Typography.Title level={4} className="collapse-title">Captain and Crew</Typography.Title>,
            children: "Captain and Crew",
        },
        {
            key: VoyageSlaveNumbersSchema.backingModel,
            label: <Typography.Title level={4} className="collapse-title">Slaves (numbers)</Typography.Title>,
            children: <EntityForm schema={VoyageSlaveNumbersSchema} handleCommentChange={handleCommentChange} />
        },
        {// Need to change to EntitySchema later
            key: "7",
            label: <Typography.Title level={4} className="collapse-title">Slaves (characteristics)</Typography.Title>,
            children: "Slaves (characteristics)",
        },
        {// Need to change to EntitySchema later
            key: "8",
            label: <Typography.Title level={4} className="collapse-title">Sources</Typography.Title>,
            children: "Sources",
        },
    ], [handleCommentChange])

    const [globalExpand, setGlobalExpand] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string[]>([]);

    const toggleExpandAll = () => {
        if (globalExpand) {
            setExpandedMenu([]);
        } else {
            setExpandedMenu(items.map((item) => item.key as string));
        }
        setGlobalExpand(!globalExpand);
    };
    return (
        <div className="contribute-content">

            <h1 className="page-title-1">New Voyage</h1>
            <p>
                Variables are organized into eight categories. Complete as many boxes
                in each category as your source(s) allow. Comments or notes on any entry
                may be added by clicking on the comment icon to the right of each input
                box. Should you wish to add a port or region that does not appear in the
                drop-down menu, please let the editors know via the note box at the foot
                of the entry form. If required, use this box for any additional
                information. You can review your complete entry at any time by clicking
                on the 'Review' button. To submit your entry you must move to the Review
                page first.
            </p>
            <Form layout="vertical" form={form}>
                <Form.Item
                    name="voyageComments"
                    label={<span className="lable-title">Voyage comments:</span >}
                // rules={[{ required: true, message: "Voyage comments are required" }]}
                >
                    <Input.TextArea rows={2} />
                </Form.Item>
                <small className="comment-small">
                    The comments above are meant for information related to the voyage
                    which does not fit any of the existing fields. For comments meant to
                    the reviewer/editor, please use the contributor's comments at the end
                    of this form or any of the specific field comment boxes.
                </small>
                <div className="expand-collapse">
                    {translatedcontribute.titleCollaps}{' '}
                    <a href="#" onClick={toggleExpandAll}>
                        {globalExpand ? translatedcontribute.expand : translatedcontribute.collapse}
                    </a>{' '}
                </div>
                <div className="collapse-container">
                    <Collapse
                        activeKey={expandedMenu}
                        items={items}
                        onChange={(keys) => setExpandedMenu(keys as string[])}
                        bordered={false}
                        ghost
                        className="custom-collapse"
                    />
                </div>
                <Divider />
                <Form.Item
                    name="contributorsComments"
                    label={<span className="lable-title">Contributor’s Comments on This Entry:</span>}
                >
                    <Input.TextArea rows={2} />
                </Form.Item>
                <Box sx={{ mt: 3, mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{
                            backgroundColor: "rgb(55, 148, 141)",
                            color: "#fff",
                            height: 35,
                            fontSize: "0.85rem",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "rgba(6, 186, 171, 0.83)",
                            },
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReview}
                        sx={{
                            backgroundColor: "transparent",
                            border: '1px solid rgb(55, 148, 141)',
                            color: "rgb(55, 148, 141)",
                            height: 35,
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            boxShadow: "transparent",
                            marginLeft: '10px',
                            "&:hover": {
                                backgroundColor: "rgb(55, 148, 141)",
                                color: '#fff'
                            },
                        }}
                    >
                        Review
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCancel}
                        sx={{
                            backgroundColor: "#dc3545",
                            border: "1px solid #dc3545",
                            color: "#fff",
                            height: 35,
                            fontSize: "0.85rem",
                            textTransform: "none",
                            boxShadow: "transparent",
                            marginLeft: "10px",
                            "&:hover": {
                                backgroundColor: "#c82333",
                            },
                        }}
                    >
                        Cancel contribution
                    </Button>
                </Box>
            </Form >
        </div >
    );
};

export default NewVoyage;
