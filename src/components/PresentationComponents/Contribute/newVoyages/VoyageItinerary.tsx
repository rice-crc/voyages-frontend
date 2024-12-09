import React, { useState } from "react";
import { Form, Input, TreeSelect } from "antd";
import { Box, IconButton } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import "@/style/newVoyages.scss";
import CommentBox from "../CommentBox";
import { TreeItemProps } from '@mui/lab';

interface VoyageItineraryData {
    int_first_port_emb: string;
    int_second_port_emb: string;
    int_first_port_dis: string;
    int_second_port_dis: string;
    int_third_port_dis: string;
    int_fourth_port_dis: string;
    port_of_departure: string
    ports_called_buying_slaves: string
    first_place_slave_purchase: string
    second_place_slave_purchase: string
    third_place_slave_purchase: string
    principal_place_of_slave_purchase: string
    port_of_call_before_atlantic_crossing: string
    number_of_ports_of_call: string
    first_landing_place: string
    second_landing_place: string
    third_landing_place: string
    principal_port_of_slave_dis: string
    place_voyage_ended: string
    imp_principal_port_slave_dis: string

}

const VoyageItinerary: React.FC = () => {
    const [itineraryData, setItineraryData] = useState<VoyageItineraryData>({
        int_first_port_emb: "",
        int_second_port_emb: "",
        int_first_port_dis: "",
        int_second_port_dis: "",
        int_third_port_dis: "",
        int_fourth_port_dis: "",
        port_of_departure: "",
        ports_called_buying_slaves: "",
        first_place_slave_purchase: "",
        second_place_slave_purchase: "",
        third_place_slave_purchase: "",
        principal_place_of_slave_purchase: "",
        port_of_call_before_atlantic_crossing: "",
        number_of_ports_of_call: "",
        first_landing_place: "",
        second_landing_place: "",
        third_landing_place: "",
        principal_port_of_slave_dis: "",
        place_voyage_ended: "",
        imp_principal_port_slave_dis: "",
    });

    const [visibleCommentField, setVisibleCommentField] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});

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


    const handleInputChange = (field: keyof VoyageItineraryData, value: string) => {
        setItineraryData({
            ...itineraryData,
            [field]: value,
        });
    };

    const handleTreeSelect = (
        field: "int_first_port_emb" | "int_second_port_emb",
        value: string
    ) => {
        setItineraryData({
            ...itineraryData,
            [field]: value,
        });
    };


    const toggleCommentBox = (field: string) => {
        setVisibleCommentField(visibleCommentField === field ? null : field);
    };

    const handleCommentChange = (field: string, value: string) => {
        setComments({
            ...comments,
            [field]: value,
        });
    };

    const filterTreeNode = (inputValue: string, treeNode: TreeItemProps) => {
        return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", margin: "auto" }}>
            <Form layout="vertical">
                <Form.Item label={<span className="form-contribute-label">First port of intended embarkation:</span>} className="form-contribute">
                    <TreeSelect
                        placeholder="Select place where ship constructed"
                        value={itineraryData.int_first_port_emb || undefined}
                        onChange={(value) => handleTreeSelect("int_first_port_emb", value)}
                        treeData={treeData}
                        style={{ width: 'calc(100% - 20px)' }}
                        dropdownStyle={{ overflow: 'auto', zIndex: 1301 }}
                        loading
                        showSearch
                        treeCheckable={true}
                        allowClear
                        multiple
                        treeDefaultExpandAll={false}
                        maxTagCount={8}
                        filterTreeNode={filterTreeNode}
                        maxTagPlaceholder={(selectedValue) =>
                            `+ ${selectedValue.length} locations ...`
                        }
                    />
                    <IconButton
                        onClick={() => toggleCommentBox("int_first_port_emb")}
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
                        isVisible={visibleCommentField === "int_first_port_emb"}
                        value={comments["int_first_port_emb"] || ""}
                        onChange={(value) => handleCommentChange("int_first_port_emb", value)}
                    />
                </Form.Item>
                <Form.Item label={<span className="form-contribute-label">Number of ports called prior to slave purchase:</span>} className="form-contribute">
                    <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                        <Input
                            type="number"
                            value={itineraryData.number_of_ports_of_call}
                            onChange={(e) => handleInputChange("number_of_ports_of_call", e.target.value)}
                            style={{ width: 'calc(100% - 20px)' }}
                        />
                        <IconButton
                            onClick={() => toggleCommentBox("number_of_ports_of_call")}
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
                    </Box>
                    <CommentBox
                        isVisible={visibleCommentField === "number_of_ports_of_call"}
                        value={comments["number_of_ports_of_call"] || ""}
                        onChange={(value) => handleCommentChange("number_of_ports_of_call", value)}
                    />
                </Form.Item>

                <Form.Item label={<span className="form-contribute-label">Principal place of slave purchase:</span>} className="form-contribute">
                    <TreeSelect
                        placeholder="Select place where ship registered"
                        value={itineraryData.int_second_port_emb}
                        onChange={(value) => handleTreeSelect("int_second_port_emb", value)}
                        treeData={treeData}
                        style={{ width: 'calc(100% - 20px)' }}
                        treeDefaultExpandAll
                    />
                    <IconButton
                        onClick={() => toggleCommentBox("int_second_port_emb")}
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
                        isVisible={visibleCommentField === "int_second_port_emb"}
                        value={comments["int_second_port_emb"] || ""}
                        onChange={(value) => handleCommentChange("int_second_port_emb", value)}
                    />
                </Form.Item>
                <div className="form_help_text">If more than one place of purchase, use the comments box to explain choice of principal place.</div>
            </Form>
        </Box>
    );
};

export default VoyageItinerary;
