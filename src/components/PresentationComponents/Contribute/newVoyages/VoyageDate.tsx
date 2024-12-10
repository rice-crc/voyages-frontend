import React, { useState } from "react";
import { Form, Select } from "antd";
import { Box, IconButton } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import "@/style/newVoyages.scss";
import CommentBox from "../CommentBox";
import CustomDatePicker from "@/components/SelectorComponents/DatePickerCustom/CustomDatePicker";

interface VoyageDateDataProps {
    dateOfDeparture: string;
    dateSlavePurcshaseBegan: string;
    dataVesselLeftLastSlavingPort: string;
    dateOfFirstDisembarkation: string;
    dateOfSecondDisembarkation: string;
    dateOfThirdDisembarkation: string;
    dateShipLeftOnReturnVoyage: string;
    dateWhenVoyageCompleted: string;
    lengthOfMiddlePassageIndays: string;
}


const VoyageDate: React.FC = () => {
    const [voyageDateData, setVoyageDateData] = useState<VoyageDateDataProps>({
        dateOfDeparture: '',
        dateSlavePurcshaseBegan: '',
        dataVesselLeftLastSlavingPort: '',
        dateOfFirstDisembarkation: '',
        dateOfSecondDisembarkation: '',
        dateOfThirdDisembarkation: '',
        dateShipLeftOnReturnVoyage: '',
        dateWhenVoyageCompleted: '',
        lengthOfMiddlePassageIndays: '',
    });
    const [visibleCommentField, setVisibleCommentField] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [year, setYear] = useState<number | undefined>(undefined);
    const [month, setMonth] = useState<string | undefined>(undefined);
    const [day, setDay] = useState<number | undefined>(undefined);


    const toggleCommentBox = (field: string) => {
        setVisibleCommentField(visibleCommentField === field ? null : field);
    };

    const handleCommentChange = (field: string, value: string) => {
        setComments({
            ...comments,
            [field]: value,
        });
    };

    const updateDateField = (
        field: keyof VoyageDateDataProps,
        formattedDate: string
        // year?: number,
        // month?: string,
        // day?: number
    ) => {
        // const formattedDate = year && month && day
        //     ? `${year}-${month}-${String(day).padStart(2, '0')}`
        //     : '';
        // console.log({ formattedDate, field })
        setVoyageDateData({
            ...voyageDateData,
            [field]: formattedDate,
        });
    };
    // console.log({ voyageDateData })

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", margin: "auto" }}>
            <Form.Item label={<span className="form-contribute-label">Date of departure:</span>} className="form-contribute">
                <CustomDatePicker
                    year={year}
                    setYear={setYear}
                    month={month}
                    setMonth={setMonth}
                    day={day}
                    setDay={setDay}
                    onDateChange={(formattedDate) => {
                        updateDateField("dateOfDeparture", formattedDate);
                    }}
                // onDateChange={(formattedDate) => {
                //     updateDateField("dateOfDeparture", year, month, day);
                // }}
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
                <CommentBox
                    isVisible={visibleCommentField === "dateOfDeparture"}
                    value={comments["dateOfDeparture"] || ""}
                    onChange={(value) => handleCommentChange("dateOfDeparture", value)}
                />
            </Form.Item>
            <Form.Item label={<span className="form-contribute-label">Date that slave purchase began:</span>} className="form-contribute">

                <IconButton
                    onClick={() => toggleCommentBox("dateSlavePurcshaseBegan")}
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
                    isVisible={visibleCommentField === "dateSlavePurcshaseBegan"}
                    value={comments["dateSlavePurcshaseBegan"] || ""}
                    onChange={(value) => handleCommentChange("dateSlavePurcshaseBegan", value)}
                />
            </Form.Item>
        </Box>
    );
};

export default VoyageDate;
