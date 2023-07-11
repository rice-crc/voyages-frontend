/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useGetOptionsQuery } from '@/fetchAPI/fetchApiService';
import { useSelector } from 'react-redux';
import { Flatlabel, IsShowProp } from '@/share/InterfaceTypes';

import { StyledTableRow } from '@/styleMUI';
import { RootState } from '@/redux/store';
import RangeSlider from '../voyagePage/Results/RangeSlider';

const TableRangeSlider = () => {
  const datas = useSelector((state: RootState) => state.getOptions.value);
  const { isLoading } = useGetOptionsQuery(datas);
  const colunmName = ['Label', 'Range-Slider', 'Display'];
  const [optionsLabel, setOptionsLabel] = useState<Flatlabel[]>([]);
  const [isShow, setIsShow] = useState<IsShowProp>({});
  const [message, setMessage] = useState<string>('');
  const [rangeValue, setRangeValue] = useState<Record<string, number[]>>({});
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  };

  const handleShowRangeSlide = (row: Flatlabel) => {
    setIsShow((prev) => ({
      ...prev,
      [row.key]: true,
    }));
    if (message) {
      setMessage('');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {colunmName.map((value, key) => (
                <TableCell
                  key={'title-' + key}
                  style={{
                    width: '33%',
                    color: '#389c90',
                    borderRight: '1px solid #ddd',
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
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleShowRangeSlide(row)}
                      component="th"
                      scope="row"
                    >
                      <div> {row.label}</div>
                    </TableCell>

                    <TableCell>
                      {isShow[row.key] && (
                        <>
                          <RangeSlider />
                        </>
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {isShow[row.key] && (
                        <>
                          <div>{row.key}</div>
                          {rangeValue?.[row.key] && (
                            <div>{`${rangeValue?.[row.key][0]} - ${
                              rangeValue?.[row.key][1]
                            }`}</div>
                          )}
                          <div style={{ color: 'red' }}>
                            {rangeValue && message}
                          </div>
                        </>
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

export default TableRangeSlider;
