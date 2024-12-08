import React, { useState } from "react";
import { Form, Select } from "antd";
import { Box, IconButton } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import "@/style/newVoyages.scss";
import CommentBox from "../CommentBox";

interface VoyageOutcomeData {
    outComeVoyage: string;
    africanResistance: string;
}


const VoyageOutcome: React.FC = () => {
    const [outcomeData, setOutCome] = useState<VoyageOutcomeData>({
        outComeVoyage: "",
        africanResistance: "",
    });
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




    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", margin: "auto" }}>
            <Form layout="vertical">
                <Form.Item label={<span className="form-contribute-label">Outcome of voyage:</span>} className="form-contribute">
                    <Select
                        placeholder="Select Outcome of voyage"
                        value={outcomeData.outComeVoyage}
                        style={{ width: 'calc(100% - 20px)' }}
                        onChange={(value) => setOutCome({ ...outcomeData, outComeVoyage: value })}
                        options={[
                            { value: "voyages", label: "Voyage completed as intended" },
                            { value: "sold", label: "Sold slaves in Americas - subsequent fate unknown" },
                        ]}
                    />
                    <IconButton
                        onClick={() => toggleCommentBox("outComeVoyage")}
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
                        isVisible={visibleCommentField === "outComeVoyage"}
                        value={comments["outComeVoyage"] || ""}
                        onChange={(value) => handleCommentChange("outComeVoyage", value)}
                    />
                </Form.Item>
                <Form.Item label={<span className="form-contribute-label">African resistance:</span>} className="form-contribute">
                    <Select
                        placeholder="Select Outcome of voyage"
                        value={outcomeData.africanResistance}
                        style={{ width: 'calc(100% - 20px)' }}
                        onChange={(value) => setOutCome({ ...outcomeData, africanResistance: value })}
                        options={[
                            { value: "voyages", label: "Voyage completed as intended" },
                            { value: "sold", label: "Sold slaves in Americas - subsequent fate unknown" },
                        ]}
                    />
                    <IconButton
                        onClick={() => toggleCommentBox("africanResistance")}
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
                        isVisible={visibleCommentField === "africanResistance"}
                        value={comments["africanResistance"] || ""}
                        onChange={(value) => handleCommentChange("africanResistance", value)}
                    />
                </Form.Item>
            </Form>
        </Box>
    );
};

export default VoyageOutcome;
