import React from "react";
import { Box } from "@mui/material";
import TextArea from "antd/es/input/TextArea";

interface CommentBoxProps {
    isVisible?: boolean;
    value?: string;
    onChange?: (value: string) => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ isVisible, value, onChange }) => {
    if (!isVisible) return null;

    return (
        <Box
            sx={{
                position: "absolute",
                top: "calc(100% + 2px)",
                right: 20,
                width: "40%",
                zIndex: 1,
                backgroundColor: "white",
                border: "1px solid #d9d9d9",
                borderRadius: 1,
                padding: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
            <TextArea
                rows={3}
                placeholder="Please type your comments here:"
                value={value}
                // onChange={(e) => onChange(e.target.value)}
                style={{ width: "100%" }}
            />
        </Box>
    );
};

export default CommentBox;
