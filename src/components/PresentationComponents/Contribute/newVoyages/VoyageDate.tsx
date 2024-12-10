// import React, { useState } from "react";
// import { Form, Select } from "antd";
// import { Box, IconButton } from "@mui/material";
// import CommentIcon from "@mui/icons-material/Comment";
// import "@/style/newVoyages.scss";
// import CommentBox from "../CommentBox";
// import CustomDatePicker from "@/components/SelectorComponents/DatePickerCustom/CustomDatePicker";

// interface VoyageDateDataProps {
// dateOfDeparture: string;
// dateSlavePurcshaseBegan: string;
// dataVesselLeftLastSlavingPort: string;
// dateOfFirstDisembarkation: string;
// dateOfSecondDisembarkation: string;
// dateOfThirdDisembarkation: string;
// dateShipLeftOnReturnVoyage: string;
// dateWhenVoyageCompleted: string;
// lengthOfMiddlePassageIndays: string;
// }


// const VoyageDate: React.FC = () => {
//     const [form] = Form.useForm(); // Ant Design Form instance
//     const [visibleCommentField, setVisibleCommentField] = useState<string | null>(null);
//     const [comments, setComments] = useState<{ [key: string]: string }>({});
//     const [year, setYear] = useState<number | undefined>(undefined);
//     const [month, setMonth] = useState<string | undefined>(undefined);
//     const [day, setDay] = useState<number | undefined>(undefined);

//     const toggleCommentBox = (field: string) => {
//         setVisibleCommentField(visibleCommentField === field ? null : field);
//     };

//     const handleCommentChange = (field: string, value: string) => {
//         setComments({
//             ...comments,
//             [field]: value,
//         });
//     };

//     const updateDateField = (field: string, formattedDate: string) => {
//         form.setFieldsValue({ [field]: formattedDate });
//     };

//     return (
//         <Form
//             form={form}
//             initialValues={{
//                 dateOfDeparture: '',
//                 dateSlavePurcshaseBegan: '',
//                 dataVesselLeftLastSlavingPort: '',
//                 dateOfFirstDisembarkation: '',
//                 dateOfSecondDisembarkation: '',
//                 dateOfThirdDisembarkation: '',
//                 dateShipLeftOnReturnVoyage: '',
//                 dateWhenVoyageCompleted: '',
//                 lengthOfMiddlePassageIndays: '',
//             }
//             }
//             layout="vertical"
//         >
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", margin: "auto" }}>
//                 <Form.Item
//                     label={<span className="form-contribute-label">Date of departure:</span>}
//                     name="dateOfDeparture"
//                     className="form-contribute"
//                 >
//                     <CustomDatePicker
//                         year={year}
//                         setYear={setYear}
//                         month={month}
//                         setMonth={setMonth}
//                         day={day}
//                         setDay={setDay}
//                         onDateChange={(formattedDate) => updateDateField("dateOfDeparture", formattedDate)}
//                     />
//                     <IconButton
//                         onClick={() => toggleCommentBox("dateOfDeparture")}
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
//                     <CommentBox
//                         isVisible={visibleCommentField === "dateOfDeparture"}
//                         value={comments["dateOfDeparture"] || ""}
//                         onChange={(value) => handleCommentChange("dateOfDeparture", value)}
//                     />
//                 </Form.Item>

//                 <Form.Item
//                     label={<span className="form-contribute-label">Date that slave purchase began:</span>}
//                     name="dateSlavePurchaseBegan"
//                     className="form-contribute"
//                 >
//                     <IconButton
//                         onClick={() => toggleCommentBox("dateSlavePurchaseBegan")}
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
//                     <CommentBox
//                         isVisible={visibleCommentField === "dateSlavePurchaseBegan"}
//                         value={comments["dateSlavePurchaseBegan"] || ""}
//                         onChange={(value) => handleCommentChange("dateSlavePurchaseBegan", value)}
//                     />
//                 </Form.Item>
//             </Box>
//         </Form>
//     );
// };

// export default VoyageDate;

import React from "react";
import { Form } from "antd";
import { Box, IconButton } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import "@/style/newVoyages.scss";
import CommentBox from "../CommentBox";
import CustomDatePicker from "@/components/SelectorComponents/DatePickerCustom/CustomDatePicker";

const VoyageDate: React.FC = () => {
    const [form] = Form.useForm(); // Ant Design Form instance

    const toggleCommentBox = (field: string) => {
        const visibleField = form.getFieldValue("visibleCommentField");
        form.setFieldsValue({
            visibleCommentField: visibleField === field ? null : field,
        });
    };

    const handleCommentChange = (field: string, value: string) => {
        const currentComments = form.getFieldValue("comments") || {};
        form.setFieldsValue({
            comments: {
                ...currentComments,
                [field]: value,
            },
        });
    };

    return (

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", margin: "auto" }}>
            <Form.Item
                label={<span className="form-contribute-label">Date of departure:</span>}
                name="dateOfDeparture"
                className="form-contribute"
            >
                <CustomDatePicker
                    onDateChange={(formattedDate) => form.setFieldsValue({ dateOfDeparture: formattedDate })}
                />
                <IconButton
                    onClick={() => toggleCommentBox("dateOfDeparture")}
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
                <Form.Item noStyle shouldUpdate>
                    {() => {
                        const visibleField = form.getFieldValue("visibleCommentField");
                        const comments = form.getFieldValue("comments") || {};
                        return (
                            <CommentBox
                                isVisible={visibleField === "dateOfDeparture"}
                                value={comments["dateOfDeparture"] || ""}
                                onChange={(value) => handleCommentChange("dateOfDeparture", value)}
                            />
                        );
                    }}
                </Form.Item>
            </Form.Item>

            <Form.Item
                label={<span className="form-contribute-label">Date that slave purchase began:</span>}
                name="dateSlavePurchaseBegan"
                className="form-contribute"
            >
                <IconButton
                    onClick={() => toggleCommentBox("dateSlavePurchaseBegan")}
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
                <Form.Item noStyle shouldUpdate>
                    {() => {
                        const visibleField = form.getFieldValue("visibleCommentField");
                        const comments = form.getFieldValue("comments") || {};
                        return (
                            <CommentBox
                                isVisible={visibleField === "dateSlavePurchaseBegan"}
                                value={comments["dateSlavePurchaseBegan"] || ""}
                                onChange={(value) => handleCommentChange("dateSlavePurchaseBegan", value)}
                            />
                        );
                    }}
                </Form.Item>
            </Form.Item>
        </Box>
    );
};

export default VoyageDate;

