

import React, { useState } from "react";
import { Button, Form, Input, Typography, Select, TreeSelect, Table } from "antd";
import { Box, IconButton } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import TextArea from "antd/es/input/TextArea";
import "@/style/newVoyages.scss";
import CommentBox from "../CommentBox";
import { TreeItemProps } from "@mui/lab";
import AddCargoModal from "./addCargoToVoyages/AddCargoModal";
import { CargoProps } from "@/share/newVoyagesType";


// const ShipNationOwners: React.FC = () => {
const ShipNationOwners: React.FC<{ form: any }> = ({ form }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCargo, setNewCargo] = useState<CargoProps>({ type: "", unit: "", amount: "" });


    const filterTreeNode = (inputValue: string, treeNode: TreeItemProps) => {
        return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
    };

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



    const handleNewCargoChange = (field: keyof CargoProps, value: string) => {
        setNewCargo({
            ...newCargo,
            [field]: value,
        });
    };

    const handleAddCargo = () => {

        setNewCargo({ type: "", unit: "", amount: "" });
        setIsModalOpen(false);
    };

    const handleDeleteCargo = (index: number) => {

    };


    const cargoColumns = [
        {
            title: "Cargo Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Unit",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any, index: number) => (
                <Button danger >
                    Delete
                </Button>
            ),
        },
    ];


    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", margin: "auto" }}>
            <Form.Item label={<span className="form-contribute-label">Name of vessel:</span>} className="form-contribute" >
                <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <Input
                        type="text"
                        placeholder="Please type name of vessel"
                        // value={shipData.nameOfVessel}
                        // onChange={(e) => handleInputChange("nameOfVessel", e.target.value)}
                        style={{ width: 'calc(100% - 20px)' }}
                    />
                    <IconButton
                        // onClick={() => toggleCommentBox("name")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "name"}
                    value={comments["vesselType"] || ""}
                    onChange={(value) => handleCommentChange("vesselType", value)}
                /> */}
            </Form.Item>

            <Form.Item label={<span className="form-contribute-label">Place where ship constructed:</span>} className="form-contribute">
                <TreeSelect
                    placeholder="Select place where ship constructed"
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
                    maxTagPlaceholder={(selectedValue) =>
                        `+ ${selectedValue.length} locations ...`
                    }
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "constructionPlace"}
                    value={comments["constructionPlace"] || ""}
                    onChange={(value) => handleCommentChange("constructionPlace", value)}
                /> */}
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Place where ship registered:</span>} className="form-contribute">
                <TreeSelect
                    placeholder="Select place where ship registered"
                    // value={shipData.registrationPlace || undefined}
                    // onChange={(value) => handleInputChange("registrationPlace", value)}
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
                    // onClick={() => toggleCommentBox("registrationPlace")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "registrationPlace"}
                    value={comments["registrationPlace"] || ""}
                    onChange={(value) => handleCommentChange("registrationPlace", value)}
                /> */}
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Year of ship construction:</span>} className="form-contribute">
                <Input
                    type="number"
                    placeholder="Please type year of ship construction"
                    // value={shipData.constructionYear}
                    style={{ width: 'calc(100% - 20px)' }}
                // onChange={(e) => handleInputChange("constructionYear", e.target.value)}
                />
                <IconButton
                    // onClick={() => toggleCommentBox("constructionYear")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "constructionYear"}
                    value={comments["constructionYear"] || ""}
                    onChange={(value) => handleCommentChange("constructionYear", value)}
                /> */}
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Year of ship registration:</span>} className="form-contribute">
                <Input
                    type="number"
                    placeholder="Please type year of ship registration"
                    // value={shipData.registrationYear}
                    style={{ width: 'calc(100% - 20px)' }}
                // onChange={(e) => handleInputChange("registrationYear", e.target.value)}
                />
                <IconButton
                    // onClick={() => toggleCommentBox("registrationYear")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "registrationYear"}
                    value={comments["registrationYear"] || ""}
                    onChange={(value) => handleCommentChange("registrationYear", value)}
                /> */}
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">National carrier:</span>} className="form-contribute">
                <Select
                    placeholder="Select national carrier"
                    // value={shipData.nationalCarrier || undefined}
                    style={{ width: 'calc(100% - 20px)' }}
                    // onChange={(value) => setShipData({ ...shipData, nationalCarrier: value })}
                    options={[
                        {
                            label: <span>Nationailites</span>,
                            title: 'manager',
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "nationalCarrier"}
                    value={comments["nationalCarrier"] || ""}
                    onChange={(value) => handleCommentChange("nationalCarrier", value)}
                /> */}

            </Form.Item>
            <div className="form_help_text">
                If not country of registration, use the comments box to explain coding.
            </div>
            <Form.Item label={<span className="form-contribute-label">Rig of vessel:</span>} className="form-contribute">
                <Select
                    placeholder="Select rig of vessel"
                    // value={shipData.rigOfVessel || undefined}
                    style={{ width: 'calc(100% - 20px)' }}
                    // onChange={(value) => setShipData({ ...shipData, rigOfVessel: value })}
                    options={[
                        {
                            label: <span>Rig of vessel</span>,
                            title: 'manager',
                            options: [
                                { label: <span>Balandra</span>, value: 'Balandra' },
                                { label: <span>Barca</span>, value: 'Barca' },
                                { label: <span>Barca a vapor</span>, value: 'Barca' },
                            ],
                        },
                    ]}

                />
                <IconButton
                    // onClick={() => toggleCommentBox("rigOfVessel")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "rigOfVessel"}
                    value={comments["rigOfVessel"] || ""}
                    onChange={(value) => handleCommentChange("rigOfVessel", value)}
                /> */}
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Tonnage of vessel:</span>} className="form-contribute">
                <Input
                    type="number"
                    placeholder="Please type tonnage of vessel"
                    // value={shipData.tonOfVessel}
                    style={{ width: 'calc(100% - 20px)' }}
                // onChange={(e) => handleInputChange("tonOfVessel", e.target.value)}
                />
                <IconButton
                    // onClick={() => toggleCommentBox("tonOfVessel")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "tonOfVessel"}
                    value={comments["tonOfVessel"] || ""}
                    onChange={(value) => handleCommentChange("tonOfVessel", value)}
                /> */}
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Definition of ton:</span>} className="form-contribute">
                <Select
                    placeholder="Select definition of ton"
                    // value={shipData.tonDefinition || undefined}
                    style={{ width: 'calc(100% - 20px)' }}
                    // onChange={(value) => setShipData({ ...shipData, tonDefinition: value })}
                    options={[
                        {
                            label: <span>Tonnage type</span>,
                            title: 'manager',
                            options: [
                                { label: <span>Argentina</span>, value: 'Argentina' },
                                { label: <span>Austrian</span>, value: 'Austrian' },
                                { label: <span>Dutch</span>, value: 'Dutch' },
                            ],
                        },
                    ]}
                />
                <IconButton
                    // onClick={() => toggleCommentBox("tonDefinition")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "tonDefinition"}
                    value={comments["tonDefinition"] || ""}
                    onChange={(value) => handleCommentChange("tonDefinition", value)}
                /> */}

            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Guns mounted:</span>} className="form-contribute">
                <Input
                    type="number"
                    placeholder="Please type guns mounted"
                    // value={shipData.gunsMounted}
                    style={{ width: 'calc(100% - 20px)' }}
                // onChange={(e) => handleInputChange("gunsMounted", e.target.value)}
                />
                <IconButton
                    // onClick={() => toggleCommentBox("gunsMounted")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "gunsMounted"}
                    value={comments["gunsMounted"] || ""}
                    onChange={(value) => handleCommentChange("gunsMounted", value)}
                /> */}
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">First or managing owner of venture:</span>} className="form-contribute">
                <Input
                    type="text"
                    placeholder="Please type first or managing owner of venture"
                    // value={shipData.firstOwner}
                    style={{ width: 'calc(100% - 20px)' }}
                // onChange={(e) => handleInputChange("firstOwner", e.target.value)}
                />
                <IconButton
                    // onClick={() => toggleCommentBox("firstOwner")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "firstOwner"}
                    value={comments["firstOwner"] || ""}
                    onChange={(value) => handleCommentChange("firstOwner", value)}
                /> */}

            </Form.Item>
            <div className="form_help_text">Enter last name , first name.</div>
            <Form.Item label={<span className="form-contribute-label">Second owner of venture:</span>} className="form-contribute">
                <Input
                    type="text"
                    placeholder="Please type second owner of venture"
                    // value={shipData.secondOwner}
                    style={{ width: 'calc(100% - 20px)' }}
                // onChange={(e) => handleInputChange("secondOwner", e.target.value)}
                />
                <IconButton
                    // onClick={() => toggleCommentBox("secondOwner")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "secondOwner"}
                    value={comments["secondOwner"] || ""}
                    onChange={(value) => handleCommentChange("secondOwner", value)}
                /> */}

            </Form.Item>
            <div className="form_help_text">Enter last name , first name.</div>
            <Form.Item label={<span className="form-contribute-label">Other owners:</span>} className="form-contribute">
                <TextArea
                    rows={2}
                    placeholder="Please type other owners"
                    // value={shipData.otherOwners}
                    style={{ width: 'calc(100% - 20px)' }}
                // onChange={(e) => handleInputChange("otherOwners", e.target.value)}
                />
                <IconButton
                    // onClick={() => toggleCommentBox("otherOwners")}
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
                {/* <CommentBox
                    isVisible={visibleCommentField === "otherOwners"}
                    value={comments["otherOwners"] || ""}
                    onChange={(value) => handleCommentChange("otherOwners", value)}
                /> */}
            </Form.Item>

            <Typography.Title level={5}>Cargo:</Typography.Title>
            <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ width: 120 }}>
                Add Cargo
            </Button>
            <Table
                columns={cargoColumns}
                // dataSource={shipData.cargo.map((cargo, index) => ({ ...cargo, key: index }))}
                pagination={false}
            />
            <AddCargoModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                handleAddCargo={handleAddCargo}
                handleNewCargoChange={handleNewCargoChange}
                setNewCargo={setNewCargo}
                newCargo={newCargo}
            // setShipData={setShipData}
            // shipData={shipData}
            />


        </Box>
    );
};

export default ShipNationOwners;



// import React, { useState } from "react";
// import { Modal, Button, Form, Input, Typography, Select, TreeSelect, Table } from "antd";
// import { Box, IconButton } from "@mui/material";
// import CommentIcon from "@mui/icons-material/Comment";
// import TextArea from "antd/es/input/TextArea";
// import "@/style/newVoyages.scss";
// import CommentBox from "../CommentBox";
// import { TreeItemProps } from "@mui/lab";


// interface ShipData {
//     name: string;
//     constructionPlace: string;
//     registrationPlace: string;
//     constructionYear: string;
//     registrationYear: string;
//     nationalCarrier: string;
//     rigOfVessel: string;
//     tonOfVessel: string;
//     tonDefinition: string;
//     gunsMounted: string;
//     firstOwner: string;
//     secondOwner: string;
//     otherOwners: string;
//     cargo: Cargo[];
// }

// interface Cargo {
//     type: string;
//     unit: string;
//     amount: string;
// }

// // const ShipNationOwners: React.FC = () => {
// const ShipNationOwners: React.FC<{ form: any }> = ({ form }) => {
//     const [shipData, setShipData] = useState<ShipData>({
//         name: "",
//         constructionPlace: "",
//         registrationPlace: "",
//         constructionYear: "",
//         registrationYear: "",
//         nationalCarrier: "",
//         rigOfVessel: "",
//         tonOfVessel: "",
//         tonDefinition: "",
//         gunsMounted: "",
//         firstOwner: "",
//         secondOwner: "",
//         otherOwners: "",
//         cargo: [{ type: "", unit: "", amount: "" }],
//     });

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [newCargo, setNewCargo] = useState<Cargo>({ type: "", unit: "", amount: "" });
//     const [visibleCommentField, setVisibleCommentField] = useState<string | null>(null);
//     const [comments, setComments] = useState<{ [key: string]: string }>({});

//     const filterTreeNode = (inputValue: string, treeNode: TreeItemProps) => {
//         return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
//     };

//     const treeData = [
//         {
//             title: 'Brazil',
//             value: 'brazil',
//             children: [
//                 {
//                     title: 'Amazonia',
//                     value: 'amazonia',
//                     children: [
//                         {
//                             title: 'Portos do Norte',
//                             value: 'portos-do-norte',
//                         },
//                     ],
//                 },
//             ],
//         },
//         {
//             title: 'Africa',
//             value: 'africa',
//             children: [
//                 {
//                     title: 'Senegambia and offshore Atlantic',
//                     value: 'senegambia',
//                     children: [
//                         { title: 'Albreda', value: 'albreda' },
//                         { title: 'Arguim', value: 'arguim' },
//                         { title: 'Bissagos', value: 'bissagos' },
//                         { title: 'Bissau', value: 'bissau' },
//                         { title: 'Cacheu', value: 'cacheu' },
//                     ],
//                 },
//             ],
//         },
//     ];

//     const handleInputChange = (field: keyof ShipData, value: string, extra?: any) => {
//         let newValue = value;

//         // If extra is provided (i.e., for TreeSelect), use the full path or value
//         if (extra) {
//             const path = extra?.triggerNode?.path || value;
//             newValue = path;
//         }

//         setShipData({
//             ...shipData,
//             [field]: newValue,
//         });
//     };

//     const handleNewCargoChange = (field: keyof Cargo, value: string) => {
//         setNewCargo({
//             ...newCargo,
//             [field]: value,
//         });
//     };

//     const handleAddCargo = () => {
//         setShipData({
//             ...shipData,
//             cargo: [...shipData.cargo, newCargo],
//         });
//         setNewCargo({ type: "", unit: "", amount: "" }); // Reset the form
//         setIsModalOpen(false);
//     };

//     const handleDeleteCargo = (index: number) => {
//         const updatedCargo = shipData.cargo.filter((_, i) => i !== index);
//         setShipData({ ...shipData, cargo: updatedCargo });
//     };

//     const toggleCommentBox = (field: string) => {
//         setVisibleCommentField(visibleCommentField === field ? null : field);
//     };

//     const handleCommentChange = (field: string, value: string) => {
//         setComments({
//             ...comments,
//             [field]: value,
//         });
//     };

//     const cargoColumns = [
//         {
//             title: "Cargo Type",
//             dataIndex: "type",
//             key: "type",
//         },
//         {
//             title: "Unit",
//             dataIndex: "unit",
//             key: "unit",
//         },
//         {
//             title: "Amount",
//             dataIndex: "amount",
//             key: "amount",
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_: any, record: Cargo, index: number) => (
//                 <Button danger onClick={() => handleDeleteCargo(index)}>
//                     Delete
//                 </Button>
//             ),
//         },
//     ];


//     return (
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", margin: "auto" }}>
//             <Form.Item label={<span className="form-contribute-label">Name of vessel:</span>} className="form-contribute">
//                 <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
//                     <Input
//                         type="text"
//                         placeholder="Please type name of vessel"
//                         value={shipData.name}
//                         onChange={(e) => handleInputChange("name", e.target.value)}
//                         style={{ width: 'calc(100% - 20px)' }}
//                     />
//                     <IconButton
//                         onClick={() => toggleCommentBox("name")}
//                         sx={{
//                             position: "absolute",
//                             right: "-15px",
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                         }}
//                         aria-label="add comment"
//                     >
//                         <CommentIcon />
//                     </IconButton>
//                 </Box>
//                 <CommentBox
//                     isVisible={visibleCommentField === "name"}
//                     value={comments["vesselType"] || ""}
//                     onChange={(value) => handleCommentChange("vesselType", value)}
//                 />
//             </Form.Item>

//             <Form.Item label={<span className="form-contribute-label">Place where ship constructed:</span>} className="form-contribute">
//                 <TreeSelect
//                     placeholder="Select place where ship constructed"
//                     value={shipData.constructionPlace || undefined}
//                     onChange={(value, label, extra) => handleInputChange("constructionPlace", value, extra)}
//                     treeData={treeData}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     dropdownStyle={{ overflow: 'auto', zIndex: 1301 }}
//                     showSearch
//                     treeCheckable={true}
//                     allowClear
//                     multiple
//                     treeDefaultExpandAll={false}
//                     maxTagCount={8}
//                     filterTreeNode={filterTreeNode}
//                     maxTagPlaceholder={(selectedValue) =>
//                         `+ ${selectedValue.length} locations ...`
//                     }
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("constructionPlace")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "constructionPlace"}
//                     value={comments["constructionPlace"] || ""}
//                     onChange={(value) => handleCommentChange("constructionPlace", value)}
//                 />
//             </Form.Item>
//             <Form.Item label={<span className="form-contribute-label">Place where ship registered:</span>} className="form-contribute">
//                 <TreeSelect
//                     placeholder="Select place where ship registered"
//                     value={shipData.registrationPlace || undefined}
//                     onChange={(value) => handleInputChange("registrationPlace", value)}
//                     treeData={treeData}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     dropdownStyle={{ overflow: 'auto', zIndex: 1301 }}
//                     showSearch
//                     treeCheckable={true}
//                     allowClear
//                     multiple
//                     treeDefaultExpandAll={false}
//                     maxTagCount={8}
//                     filterTreeNode={filterTreeNode}
//                     maxTagPlaceholder={(selectedValue) =>
//                         `+ ${selectedValue.length} locations ...`
//                     }
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("registrationPlace")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "registrationPlace"}
//                     value={comments["registrationPlace"] || ""}
//                     onChange={(value) => handleCommentChange("registrationPlace", value)}
//                 />
//             </Form.Item>
//             <Form.Item label={<span className="form-contribute-label">Year of ship construction:</span>} className="form-contribute">
//                 <Input
//                     type="number"
//                     placeholder="Please type year of ship construction"
//                     value={shipData.constructionYear}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(e) => handleInputChange("constructionYear", e.target.value)}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("constructionYear")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "constructionYear"}
//                     value={comments["constructionYear"] || ""}
//                     onChange={(value) => handleCommentChange("constructionYear", value)}
//                 />
//             </Form.Item>
//             <Form.Item label={<span className="form-contribute-label">Year of ship registration:</span>} className="form-contribute">
//                 <Input
//                     type="number"
//                     placeholder="Please type year of ship registration"
//                     value={shipData.registrationYear}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(e) => handleInputChange("registrationYear", e.target.value)}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("registrationYear")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "registrationYear"}
//                     value={comments["registrationYear"] || ""}
//                     onChange={(value) => handleCommentChange("registrationYear", value)}
//                 />
//             </Form.Item>
//             <Form.Item label={<span className="form-contribute-label">National carrier:</span>} className="form-contribute">
//                 <Select
//                     placeholder="Select national carrier"
//                     value={shipData.nationalCarrier || undefined}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(value) => setShipData({ ...shipData, nationalCarrier: value })}
//                     options={[
//                         {
//                             label: <span>Nationailites</span>,
//                             title: 'manager',
//                             options: [
//                                 { label: <span>Argentinad</span>, value: 'Argentina' },
//                                 { label: <span>Denmark</span>, value: 'Denmark' },
//                                 { label: <span>U.S.A.</span>, value: 'usa' },
//                             ],
//                         },

//                     ]}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("nationalCarrier")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "nationalCarrier"}
//                     value={comments["nationalCarrier"] || ""}
//                     onChange={(value) => handleCommentChange("nationalCarrier", value)}
//                 />

//             </Form.Item>
//             <div className="form_help_text">
//                 If not country of registration, use the comments box to explain coding.
//             </div>
//             <Form.Item label={<span className="form-contribute-label">Rig of vessel:</span>} className="form-contribute">
//                 <Select
//                     placeholder="Select rig of vessel"
//                     value={shipData.rigOfVessel || undefined}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(value) => setShipData({ ...shipData, rigOfVessel: value })}
//                     options={[
//                         {
//                             label: <span>Rig of vessel</span>,
//                             title: 'manager',
//                             options: [
//                                 { label: <span>Balandra</span>, value: 'Balandra' },
//                                 { label: <span>Barca</span>, value: 'Barca' },
//                                 { label: <span>Barca a vapor</span>, value: 'Barca' },
//                             ],
//                         },
//                     ]}

//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("rigOfVessel")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "rigOfVessel"}
//                     value={comments["rigOfVessel"] || ""}
//                     onChange={(value) => handleCommentChange("rigOfVessel", value)}
//                 />
//             </Form.Item>
//             <Form.Item label={<span className="form-contribute-label">Tonnage of vessel:</span>} className="form-contribute">
//                 <Input
//                     type="number"
//                     placeholder="Please type tonnage of vessel"
//                     value={shipData.tonOfVessel}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(e) => handleInputChange("tonOfVessel", e.target.value)}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("tonOfVessel")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "tonOfVessel"}
//                     value={comments["tonOfVessel"] || ""}
//                     onChange={(value) => handleCommentChange("tonOfVessel", value)}
//                 />
//             </Form.Item>
//             <Form.Item label={<span className="form-contribute-label">Definition of ton:</span>} className="form-contribute">
//                 <Select
//                     placeholder="Select definition of ton"
//                     value={shipData.tonDefinition || undefined}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(value) => setShipData({ ...shipData, tonDefinition: value })}
//                     options={[
//                         {
//                             label: <span>Tonnage type</span>,
//                             title: 'manager',
//                             options: [
//                                 { label: <span>Argentina</span>, value: 'Argentina' },
//                                 { label: <span>Austrian</span>, value: 'Austrian' },
//                                 { label: <span>Dutch</span>, value: 'Dutch' },
//                             ],
//                         },
//                     ]}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("tonDefinition")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "tonDefinition"}
//                     value={comments["tonDefinition"] || ""}
//                     onChange={(value) => handleCommentChange("tonDefinition", value)}
//                 />

//             </Form.Item>
//             <Form.Item label={<span className="form-contribute-label">Guns mounted:</span>} className="form-contribute">
//                 <Input
//                     type="number"
//                     placeholder="Please type guns mounted"
//                     value={shipData.gunsMounted}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(e) => handleInputChange("gunsMounted", e.target.value)}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("gunsMounted")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "gunsMounted"}
//                     value={comments["gunsMounted"] || ""}
//                     onChange={(value) => handleCommentChange("gunsMounted", value)}
//                 />
//             </Form.Item>
//             <Form.Item label={<span className="form-contribute-label">First or managing owner of venture:</span>} className="form-contribute">
//                 <Input
//                     type="text"
//                     placeholder="Please type first or managing owner of venture"
//                     value={shipData.firstOwner}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(e) => handleInputChange("firstOwner", e.target.value)}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("firstOwner")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "firstOwner"}
//                     value={comments["firstOwner"] || ""}
//                     onChange={(value) => handleCommentChange("firstOwner", value)}
//                 />

//             </Form.Item>
//             <div className="form_help_text">Enter last name , first name.</div>
//             <Form.Item label={<span className="form-contribute-label">Second owner of venture:</span>} className="form-contribute">
//                 <Input
//                     type="text"
//                     placeholder="Please type second owner of venture"
//                     value={shipData.secondOwner}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(e) => handleInputChange("secondOwner", e.target.value)}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("secondOwner")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "secondOwner"}
//                     value={comments["secondOwner"] || ""}
//                     onChange={(value) => handleCommentChange("secondOwner", value)}
//                 />

//             </Form.Item>
//             <div className="form_help_text">Enter last name , first name.</div>
//             <Form.Item label={<span className="form-contribute-label">Other owners:</span>} className="form-contribute">
//                 <TextArea
//                     rows={2}
//                     placeholder="Please type other owners"
//                     value={shipData.otherOwners}
//                     style={{ width: 'calc(100% - 20px)' }}
//                     onChange={(e) => handleInputChange("otherOwners", e.target.value)}
//                 />
//                 <IconButton
//                     onClick={() => toggleCommentBox("otherOwners")}
//                     sx={{
//                         position: "absolute",
//                         right: "-15px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                     }}
//                     aria-label="add comment"
//                 >
//                     <CommentIcon />
//                 </IconButton>
//                 <CommentBox
//                     isVisible={visibleCommentField === "otherOwners"}
//                     value={comments["otherOwners"] || ""}
//                     onChange={(value) => handleCommentChange("otherOwners", value)}
//                 />
//             </Form.Item>

//             <Typography.Title level={5}>Cargo:</Typography.Title>
//             <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ width: 120 }}>
//                 Add Cargo
//             </Button>
//             <Table
//                 columns={cargoColumns}
//                 dataSource={shipData.cargo.map((cargo, index) => ({ ...cargo, key: index }))}
//                 pagination={false}
//             />

//             <Modal
//                 title="Add Cargo to Voyage"
//                 open={isModalOpen}
//                 onCancel={() => setIsModalOpen(false)}
//                 onOk={handleAddCargo}
//                 okText="Confirm"
//                 cancelText="Cancel"
//             >
//                 <Form.Item label="Cargo Type">
//                     <Input
//                         value={newCargo.type}
//                         onChange={(e) => handleNewCargoChange("type", e.target.value)}
//                     />
//                 </Form.Item>
//                 <Form.Item label="Unit">
//                     <Input
//                         value={newCargo.unit}
//                         onChange={(e) => handleNewCargoChange("unit", e.target.value)}
//                     />
//                 </Form.Item>
//                 <Form.Item label="Amount">
//                     <Input
//                         type="number"
//                         value={newCargo.amount}
//                         onChange={(e) => handleNewCargoChange("amount", e.target.value)}
//                     />
//                 </Form.Item>
//             </Modal>
//         </Box>
//     );
// };

// export default ShipNationOwners;