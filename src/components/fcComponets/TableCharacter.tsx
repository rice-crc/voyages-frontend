/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TablePagination,
} from "@mui/material";

import { useSelector } from "react-redux";
import {
  AutoCompleteOption,
  Flatlabel,
  IsShowProp,
  Options,
} from "../../share/InterfaceTypes";
import { StyledTableRow } from "../../styleMUI";
import { fetchOptionsData } from "../../fetchAPI/fetchOptionsData";
import { RootState } from "../../redux/store";
import AutocompleteBox from "../AutocompletedBox";
import { useGetOptionsQuery } from "../../fetchAPI/fetchApiService";

const TableCharacter = () => {
  const datas = useSelector((state: RootState) => state.getOptions.value);
  const [optionsLabel, setOptionsLabel] = useState<Flatlabel[]>([]);
  const { data, isLoading, isSuccess } = useGetOptionsQuery(datas);
  const colunmName = ["Label", "Auto Complete", "Display"];
  const [isShow, setIsShow] = useState<IsShowProp>({});
  const [value, setValue] = useState<AutoCompleteOption[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    if (isSuccess) {
      const fetchData = async () => {
        const options = await fetchOptionsData(data as Options);
        setOptionsLabel(options);
      };
      fetchData();
    }
  }, [isSuccess, data]);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  };

  const handleShowSearch = (row: Flatlabel) => {
    setIsShow((prev) => ({
      ...prev,
      [row.key]: true,
    }));
  };

  if (isLoading) {
    <div className="spinner"></div>;
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {colunmName.map((value, key) => (
                <TableCell
                  key={"title-" + key}
                  style={{
                    width: "33%",
                    color: "#389c90",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {optionsLabel
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row) => {
                return (
                  <StyledTableRow
                    key={`row${row.key}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      style={{ cursor: "pointer" }}
                      onClick={() => handleShowSearch(row)}
                      component="th"
                      scope="row"
                    >
                      <div> {row.label}</div>
                    </TableCell>
                    <TableCell>
                      {isShow[row.key] && (
                        <AutocompleteBox
                          keyOption={row.key}
                          setValue={setValue}
                          value={value}
                        />
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {isShow[row.key] && value && value?.length > 0 ? (
                        value.map((value) => <div key={value.id}>----</div>)
                      ) : (
                        <div>---</div>
                      )}
                    </TableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} margin={2} direction="row" justifyContent="flex-end">
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          component="div"
          count={optionsLabel.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Stack>
    </Box>
  );
};

export default TableCharacter;
