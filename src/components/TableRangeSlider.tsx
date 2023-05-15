/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Table, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, TablePagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGetOptionsQuery } from '../fetchAPI/fetchApiService'
import GetSlider from "./Slider";
import { useSelector } from "react-redux";
import { VoyageOptionsValue, Flatlabel, IsShowProp, Options } from '../share/TableRangeSliderType'

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

const TableRangeSlider = () => {
  const optionsFlatlabel: Flatlabel[] = [];
  const datas = useSelector((state: any) => state.getOptions.value);

  const resultOptions = useGetOptionsQuery(datas);
  
  const [isShow, setIsShow] = useState<IsShowProp>({});
  const [message, setMessage] = useState<string>('')

  const [rangeValue, setRangeValue] = useState<Record<string, number[]>>({});

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  if (resultOptions.isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>Loading</h1>
      </div>
    );

  }
 
  const options: Options = resultOptions.data as Options
  console.log('options',options)

  Object.entries(options).forEach(([key, value]: [string, VoyageOptionsValue], index: number) => {
    const intergerDecimal = value.type.replace(/'>/g, "").split(".");
    intergerDecimal.forEach((element: string) => {
      if (element === `IntegerField` || element === `DecimalField`) {
        optionsFlatlabel.push({ key: key, label: value.flatlabel, id: index });
      }
    });
  });

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  };

  const colunmName = ["Flatlabel", "Range Slider", "Json Display"];
  const handleShowRangeSlide = (row: Flatlabel) => {

    setIsShow((prev) => ({
      ...prev, [row.id]: true
    }))
    if (message) {
      setMessage("")
    }
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
            {optionsFlatlabel?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => (
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
                  {isShow[row.id] && <GetSlider
                    setRangeValue={setRangeValue}
                    label={row.label}
                    isShow={isShow}
                    keyOption={row.key}
                    idOption={row.id}
                    rangeValue={rangeValue}
                    setMessage={setMessage} />}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {isShow[row.id] &&
                    <><div>{row.key}</div>
                      {rangeValue?.[row.id] && <div>{`${(rangeValue?.[row.id][0])} - ${(rangeValue?.[row.id][1])}`}</div>}
                      <div style={{ color: 'red' }}>{rangeValue && message}</div>
                    </>
                  }
                </TableCell>
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          component="div"
          count={optionsFlatlabel.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Stack>
    </Box>
  );
}

export default TableRangeSlider;