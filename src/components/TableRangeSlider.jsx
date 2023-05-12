import { useState } from "react";
import {Table, Box,TableBody,TableCell,TableContainer,TableHead, TableRow, Paper, Stack,Pagination} from "@mui/material";
import { styled } from "@mui/material/styles";
import  {useGetOptionsQuery} from '../fetchAPI/fetchApiService'
import GetSlider from "./Slider";
import { useSelector } from "react-redux";

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
  const datas = useSelector((state)=> state.getOptions.value);
  const resultOptions = useGetOptionsQuery(datas);
  const [isObjects, setObjects] = useState({});

  if (resultOptions.isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>Loading</h1>
      </div>
    );
  }

  const options = resultOptions.data;
  Object.entries(options).forEach(([key, value], index) => {
    const intergerDecimal = value.type.replace(/'>/g, "").split(".");
    intergerDecimal.forEach((element) => {
      if (element === `IntegerField` || element === `DecimalField`) {
        optionsFlatlabel.push({ key: key, label: value.flatlabel, id: index });
      }
    });
  });

  const handleChangePagePagination = (event, newPage) => {
    //console.log("newPagePagi", newPage);
    // setPage(newPage - 1);
  };

  const colunmName = ["Flatlabel", "Range Slider", "Json Display"];
  const handleShowRangeSlide = (row) => {
    setObjects((prev)=> ({
     ...prev, [row.id] : true
    }))
  };
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {colunmName.map((value, key) => (
                <TableCell
                  key={"title-" + key}
                  style={{ width: "33%", color: "#389c90", borderRight: '1px solid #ddd' }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {optionsFlatlabel?.map((row) => (
              <StyledTableRow
                key={`row${row.id}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowRangeSlide(row)}
                  component="th"
                  scope="row"
                > 
                  {row.label}
                </TableCell>
                <TableCell>
                  {isObjects[row.id] ? <GetSlider label={row.label} isObjects={isObjects} keyOption={row.key} idOption={row.id}/> : ''}
                  </TableCell>
                <TableCell>Display Json</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
         <Stack
         spacing={2}
         margin={2}
         direction="row"
         justifyContent="flex-end"
       >
        <Pagination count={10} color="primary" />
       </Stack>
         </Box>
  );
}
