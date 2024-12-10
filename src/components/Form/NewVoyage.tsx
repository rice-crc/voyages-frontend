import "@/style/contributeContent.scss";
import "@/style/newVoyages.scss";
import { Box, Button } from "@mui/material";
import { Collapse, Divider, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import type { CollapseProps } from "antd";
import VoyageOutcome from "../PresentationComponents/Contribute/newVoyages/VoyageOutcome";
import React from "react";
import { EntityForm } from "../PresentationComponents/Contribute/EntityForm";
import { VoyageShipEntitySchema, VoyageSlaveNumbersSchema, VoyageItinerarySchema, VoyageDatesSchema } from "@/models/entities";
import { EntitySchema } from "@/models/entities"

export interface EntityFormProps {
    schema: EntitySchema
}
const NewVoyage: React.FC = () => {
    const [form] = Form.useForm();
    const [visibleCommentField, setVisibleCommentField] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const toggleCommentBox = (field: string) => {
        setVisibleCommentField(visibleCommentField === field ? null : field);
    };

    const handleCommentChange = (field: string, value: string) => {
        setComments({
            ...comments,
            [field]: value,
        });
    };


    // Handlers for the form submission
    const handleSave = () => {
        form.validateFields()
            .then((values) => {
                console.log("Save values:", values);
                message.success("Voyage saved successfully!");
            })
            .catch((error) => {
                message.error("Please correct the errors before saving.");
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

    const items: CollapseProps["items"] = [
        {
            key: VoyageShipEntitySchema.backingModel,
            label: <Typography.Title level={4} className="collapse-title">Ship, Nation, Owners</Typography.Title>,
            children: <EntityForm schema={VoyageShipEntitySchema} toggleCommentBox={toggleCommentBox} handleCommentChange={handleCommentChange} visibleCommentField={visibleCommentField} />
        },
        { // Need to change to EntitySchema later
            key: "2",
            label: <Typography.Title level={4} className="collapse-title">Voyage Outcome</Typography.Title>,
            children: <VoyageOutcome />,
        },
        {
            key: VoyageItinerarySchema.backingModel,
            label: <Typography.Title level={4} className="collapse-title">Voyage Itinerary</Typography.Title>,
            children: <EntityForm schema={VoyageItinerarySchema} toggleCommentBox={toggleCommentBox} handleCommentChange={handleCommentChange} visibleCommentField={visibleCommentField} />
        },
        {
            key: VoyageDatesSchema.backingModel,
            label: <Typography.Title level={4} className="collapse-title">Voyage Dates</Typography.Title>,
            children: <EntityForm schema={VoyageDatesSchema} toggleCommentBox={toggleCommentBox} handleCommentChange={handleCommentChange} visibleCommentField={visibleCommentField} />
        },
        { // Need to change to EntitySchema later
            key: "5",
            label: <Typography.Title level={4} className="collapse-title">Captain and Crew</Typography.Title>,
            children: "Captain and Crew",
        },
        {
            key: VoyageSlaveNumbersSchema.backingModel,
            label: <Typography.Title level={4} className="collapse-title">Slaves (numbers)</Typography.Title>,
            children: <EntityForm schema={VoyageSlaveNumbersSchema} toggleCommentBox={toggleCommentBox} handleCommentChange={handleCommentChange} visibleCommentField={visibleCommentField} />
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
    ];

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
                    label={<small>Voyage comments:</small>}
                    rules={[{ required: true, message: "Voyage comments are required" }]}
                >
                    <Input.TextArea rows={2} />
                </Form.Item>
                <small className="comment-small">
                    The comments above are meant for information related to the voyage
                    which does not fit any of the existing fields. For comments meant to
                    the reviewer/editor, please use the contributor's comments at the end
                    of this form or any of the specific field comment boxes.
                </small>
                <div className="collapse-container">
                    <Collapse items={items} bordered={false} ghost className="custom-collapse" />
                </div>

                <Divider />
                <Form.Item
                    name="contributorsComments"
                    label={<small>Contributor’s Comments on This Entry:</small>}
                >
                    <Input.TextArea rows={2} />
                </Form.Item>
                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{
                            backgroundColor: "rgb(25, 118, 210 ,10)",
                            color: "#fff",
                            height: 35,
                            fontSize: "0.85rem",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "rgb(10 131 253)",
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
                            border: "1px solid rgb(25, 118, 210)",
                            color: "rgb(25, 118, 210)",
                            height: 35,
                            fontSize: "0.85rem",
                            textTransform: "none",
                            boxShadow: "transparent",
                            marginLeft: "10px",
                            "&:hover": {
                                backgroundColor: "rgb(25, 118, 210 ,10)",
                                color: "#fff",
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
            </Form>
        </div>
    );
};

export default NewVoyage;
