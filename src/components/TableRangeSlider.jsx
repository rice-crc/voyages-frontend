import { useState } from "react";
import Tables from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { requestOptions } from "../fetchAPI/FetchOptions";
import VoyageContext from "../context/VoyageContext";
import { useQuery } from "react-query";
import { styled } from "@mui/material/styles";
import GetSlider from "./Slider";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 1,
  },
  "&:hover": {
    backgroundColor: "#85d4cb",
  },
}));

export default function TableRangeSlider() {
  const optionsFlatlabel = [];
  const results = useQuery("Options", requestOptions);
  const [isShowSlider, setIsShowSlider] = useState(false);
  const [labelId, setLableId] = useState(null);

  if (results.isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>Loading</h1>
      </div>
    );
  }

  const options = results?.data;
  Object.entries(options).forEach(([key, value], index) => {
    const intergerDecimal = value.type.replace(/'>/g, "").split(".");
    intergerDecimal.forEach((element) => {
      if (element === `IntegerField` || element === `DecimalField`) {
        optionsFlatlabel.push({ key: key, label: value.flatlabel, id: index });
      }
    });
  });

  const colunmName = ["Flatlabel", "Range Slider", "Json Display"];
  const handleShowRangeSlide = (options, id) => {
    setLableId(id);
    setIsShowSlider(!isShowSlider);
  };
  // Limit Length
  const data = optionsFlatlabel.slice(0, 6);
  // console.log('optionsFlatlabel-->', optionsFlatlabel)
  return (
    <VoyageContext.Provider
      value={{ setIsShowSlider, isShowSlider, optionsFlatlabel, labelId }}
    >
      <TableContainer component={Paper}>
        <Tables aria-label="simple table">
          <TableHead>
            <TableRow>
              {colunmName.map((value, key) => (
                <TableCell
                  key={"title-" + key}
                  style={{ width: "33%", color: "#389c90" }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {optionsFlatlabel?.map((options, idx) => ( */}
            {data?.map((options, idx) => (
              <StyledTableRow
                key={`row${idx}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowRangeSlide(options.key, idx)}
                  component="th"
                  scope="row"
                >
                  {options.label}
                </TableCell>
                <TableCell>{isShowSlider && <GetSlider />}</TableCell>
                <TableCell>Display Json</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Tables>
      </TableContainer>
    </VoyageContext.Provider>
  );
}
