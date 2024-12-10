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
    number_of_ports_of_call_prior: string
    ports_called_buying_slaves: string
    first_place_slave_purchase: string
    second_place_slave_purchase: string
    third_place_slave_purchase: string
    principal_place_of_slave_purchase: string
    port_of_call_before_atlantic_crossing: string
    number_of_newworld_port_of_call_before_dis: string
    first_landing_place: string
    second_landing_place: string
    third_landing_place: string
    principal_port_of_slave_dis: string
    place_voyage_ended: string
    // imp_principal_port_slave_dis: string

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
        number_of_ports_of_call_prior: "",
        ports_called_buying_slaves: "",
        first_place_slave_purchase: "",
        second_place_slave_purchase: "",
        third_place_slave_purchase: "",
        principal_place_of_slave_purchase: "",
        port_of_call_before_atlantic_crossing: "",
        number_of_newworld_port_of_call_before_dis: "",
        first_landing_place: "",
        second_landing_place: "",
        third_landing_place: "",
        principal_port_of_slave_dis: "",
        place_voyage_ended: "",
        // imp_principal_port_slave_dis: "",
    });

    const [visibleCommentField, setVisibleCommentField] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});

    const treeData = [
        {
            label: 'Ports',
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


    const handleInputChange = (field: keyof VoyageItineraryData, value: string, extra?: any) => {
        let newValue = value;

        // If extra is provided (i.e., for TreeSelect), use the full path or value
        if (extra) {
            const path = extra?.triggerNode?.path || value;
            newValue = path;
        }

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
            <Form.Item label={<span className="form-contribute-label">First port of intended embarkation:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.int_first_port_emb || undefined}
                    onChange={(value) => handleInputChange("int_first_port_emb", value)}
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
            <Form.Item label={<span className="form-contribute-label">Second port of intended embarkation:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.int_second_port_emb || undefined}
                    onChange={(value) => handleInputChange("int_second_port_emb", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
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
            <Form.Item label={<span className="form-contribute-label">First port of intended disembarkation:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.int_first_port_dis || undefined}
                    onChange={(value) => handleInputChange("int_first_port_dis", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("int_first_port_dis")}
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
                    isVisible={visibleCommentField === "int_first_port_dis"}
                    value={comments["int_first_port_dis"] || ""}
                    onChange={(value) => handleCommentChange("int_first_port_dis", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Second port of intended disembarkation:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.int_second_port_dis || undefined}
                    onChange={(value) => handleInputChange("int_second_port_dis", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("int_second_port_dis")}
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
                    isVisible={visibleCommentField === "int_second_port_dis"}
                    value={comments["int_second_port_dis"] || ""}
                    onChange={(value) => handleCommentChange("int_second_port_dis", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Third port of intended disembarkation:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.int_third_port_dis || undefined}
                    onChange={(value) => handleInputChange("int_third_port_dis", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("int_third_port_dis")}
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
                    isVisible={visibleCommentField === "int_third_port_dis"}
                    value={comments["int_third_port_dis"] || ""}
                    onChange={(value) => handleCommentChange("int_third_port_dis", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Fourth port of intended disembarkation:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.int_fourth_port_dis || undefined}
                    onChange={(value) => handleInputChange("int_fourth_port_dis", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("int_fourth_port_dis")}
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
                    isVisible={visibleCommentField === "int_fourth_port_dis"}
                    value={comments["int_fourth_port_dis"] || ""}
                    onChange={(value) => handleCommentChange("int_fourth_port_dis", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Port of departure:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.port_of_departure || undefined}
                    onChange={(value) => handleInputChange("port_of_departure", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("port_of_departure")}
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
                    isVisible={visibleCommentField === "port_of_departure"}
                    value={comments["port_of_departure"] || ""}
                    onChange={(value) => handleCommentChange("port_of_departure", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Number of ports called prior to slave purchase:</span>} className="form-contribute">
                <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <Input
                        type="number"
                        value={itineraryData.number_of_ports_of_call_prior}
                        onChange={(e) => handleInputChange("number_of_ports_of_call_prior", e.target.value)}
                        style={{ width: 'calc(100% - 20px)' }}
                    />
                    <IconButton
                        onClick={() => toggleCommentBox("number_of_ports_of_call_prior")}
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
                    isVisible={visibleCommentField === "number_of_ports_of_call_prior"}
                    value={comments["number_of_ports_of_call_prior"] || ""}
                    onChange={(value) => handleCommentChange("number_of_ports_of_call_prior", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">First place of slave purchase:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.first_place_slave_purchase || undefined}
                    onChange={(value) => handleInputChange("first_place_slave_purchase", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("first_place_slave_purchase")}
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
                    isVisible={visibleCommentField === "first_place_slave_purchase"}
                    value={comments["first_place_slave_purchase"] || ""}
                    onChange={(value) => handleCommentChange("first_place_slave_purchase", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Second place of slave purchase:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.second_place_slave_purchase || undefined}
                    onChange={(value) => handleInputChange("second_place_slave_purchase", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("second_place_slave_purchase")}
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
                    isVisible={visibleCommentField === "second_place_slave_purchase"}
                    value={comments["second_place_slave_purchase"] || ""}
                    onChange={(value) => handleCommentChange("second_place_slave_purchase", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Third place of slave purchase:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.third_place_slave_purchase || undefined}
                    onChange={(value) => handleInputChange("third_place_slave_purchase", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("third_place_slave_purchase")}
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
                    isVisible={visibleCommentField === "third_place_slave_purchase"}
                    value={comments["third_place_slave_purchase"] || ""}
                    onChange={(value) => handleCommentChange("third_place_slave_purchase", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Principal place of slave purchase:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.principal_place_of_slave_purchase || undefined}
                    onChange={(value) => handleInputChange("principal_place_of_slave_purchase", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("principal_place_of_slave_purchase")}
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
                    isVisible={visibleCommentField === "principal_place_of_slave_purchase"}
                    value={comments["principal_place_of_slave_purchase"] || ""}
                    onChange={(value) => handleCommentChange("principal_place_of_slave_purchase", value)}
                />
            </Form.Item>
            <div className="form_help_text">If more than one place of purchase, use the comments box to explain choice of principal place.</div>
            <Form.Item label={<span className="form-contribute-label">Places of call before Atlantic crossing:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.port_of_call_before_atlantic_crossing || undefined}
                    onChange={(value) => handleInputChange("port_of_call_before_atlantic_crossing", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("port_of_call_before_atlantic_crossing")}
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
                    isVisible={visibleCommentField === "port_of_call_before_atlantic_crossing"}
                    value={comments["port_of_call_before_atlantic_crossing"] || ""}
                    onChange={(value) => handleCommentChange("port_of_call_before_atlantic_crossing", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Number of New World ports of call before disembarkation:</span>} className="form-contribute">
                <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <Input
                        type="number"
                        value={itineraryData.number_of_newworld_port_of_call_before_dis}
                        onChange={(e) => handleInputChange("number_of_newworld_port_of_call_before_dis", e.target.value)}
                        style={{ width: 'calc(100% - 20px)' }}
                    />
                    <IconButton
                        onClick={() => toggleCommentBox("number_of_newworld_port_of_call_before_dis")}
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
                    isVisible={visibleCommentField === "number_of_newworld_port_of_call_before_dis"}
                    value={comments["number_of_newworld_port_of_call_before_dis"] || ""}
                    onChange={(value) => handleCommentChange("number_of_newworld_port_of_call_before_dis", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">First place of landing:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.first_landing_place || undefined}
                    onChange={(value) => handleInputChange("first_landing_place", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("first_landing_place")}
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
                    isVisible={visibleCommentField === "first_landing_place"}
                    value={comments["first_landing_place"] || ""}
                    onChange={(value) => handleCommentChange("first_landing_place", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Second place of landing:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.second_landing_place || undefined}
                    onChange={(value) => handleInputChange("second_landing_place", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("second_landing_place")}
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
                    isVisible={visibleCommentField === "second_landing_place"}
                    value={comments["second_landing_place"] || ""}
                    onChange={(value) => handleCommentChange("second_landing_place", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Third place of landing:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.third_landing_place || undefined}
                    onChange={(value) => handleInputChange("third_landing_place", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("third_landing_place")}
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
                    isVisible={visibleCommentField === "third_landing_place"}
                    value={comments["third_landing_place"] || ""}
                    onChange={(value) => handleCommentChange("third_landing_place", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Principal place of slave disembarkation:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.principal_port_of_slave_dis || undefined}
                    onChange={(value) => handleInputChange("principal_port_of_slave_dis", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("principal_port_of_slave_dis")}
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
                    isVisible={visibleCommentField === "principal_port_of_slave_dis"}
                    value={comments["principal_port_of_slave_dis"] || ""}
                    onChange={(value) => handleCommentChange("principal_port_of_slave_dis", value)}
                />
            </Form.Item>
            <div className="form_help_text">If more than one place of landing, use the comments box to explain choice of principal place.</div>
            <Form.Item label={<span className="form-contribute-label">Port at which voyage ended:</span>} className="form-contribute">
                <TreeSelect
                    value={itineraryData.place_voyage_ended || undefined}
                    onChange={(value) => handleInputChange("place_voyage_ended", value)}
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
                />
                <IconButton
                    onClick={() => toggleCommentBox("place_voyage_ended")}
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
                    isVisible={visibleCommentField === "place_voyage_ended"}
                    value={comments["place_voyage_ended"] || ""}
                    onChange={(value) => handleCommentChange("place_voyage_ended", value)}
                />
            </Form.Item>


        </Box>
    );
};

export default VoyageItinerary;
