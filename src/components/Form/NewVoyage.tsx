import "@/style/contributeContent.scss";
import "@/style/newVoyages.scss";
import { Box, Button } from "@mui/material";
import { Collapse, Divider, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import type { CollapseProps } from "antd";
import ShipNationOwners from "../PresentationComponents/Contribute/newVoyages/ShipNationOwners";
import VoyageOutcome from "../PresentationComponents/Contribute/newVoyages/VoyageOutcome";
import VoyageItinerary from "../PresentationComponents/Contribute/newVoyages/VoyageItinerary";
import VoyageDate from "../PresentationComponents/Contribute/newVoyages/VoyageDate";

const NewVoyage: React.FC = () => {
    const [form] = Form.useForm();

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
        form.resetFields(); // Clear form fields
        message.warning("Contribution canceled.");
    };

    const items: CollapseProps["items"] = [
        {
            key: "1",
            label: <Typography.Title level={4} className="collapse-title">Ship, Nation, Owners</Typography.Title>,
            children: <ShipNationOwners />,
        },
        {
            key: "2",
            label: <Typography.Title level={4} className="collapse-title">Voyage Outcome</Typography.Title>,
            children: <VoyageOutcome />,
        },
        {
            key: "3",
            label: <Typography.Title level={4} className="collapse-title">Voyage Itinerary</Typography.Title>,
            children: <VoyageItinerary />,
        },
        {
            key: "4",
            label: <Typography.Title level={4} className="collapse-title">Voyage Dates</Typography.Title>,
            children: <VoyageDate />,
        },
        {
            key: "5",
            label: <Typography.Title level={4} className="collapse-title">Captain and Crew</Typography.Title>,
            children: "Captain and Crew",
        },
        {
            key: "6",
            label: <Typography.Title level={4} className="collapse-title">Slaves (numbers)</Typography.Title>,
            children: "Slaves (numbers)",
        },
        {
            key: "7",
            label: <Typography.Title level={4} className="collapse-title">Slaves (characteristics)</Typography.Title>,
            children: "Slaves (characteristics)",
        },
        {
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
