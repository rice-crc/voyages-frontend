import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { FunctionComponent } from 'react';
import {
  EstimateRowVar,
  EstimateColumnVar,
  EstimateCellVar,
  EstimateOptionProps,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';

interface SelectDropdownEstimateTableProps {
  selectRowValue: EstimateRowVar[];
  selectColumnValue: EstimateColumnVar[];
  selectCellValue: EstimateCellVar[];
  selectedPivottablesOptions: EstimateOptionProps;
  handleChangeOptions: (event: SelectChangeEvent<string[]>, name: string, selectRowValue?: EstimateRowVar[]) => void;
  handleButtonExportCSV: () => void
  setMode: React.Dispatch<React.SetStateAction<string>>
}

export const SelectDropdownEstimateTable: FunctionComponent<
  SelectDropdownEstimateTableProps
> = ({
  selectRowValue,
  selectColumnValue,
  selectCellValue,
  selectedPivottablesOptions,
  handleChangeOptions, handleButtonExportCSV, setMode
}) => {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      disableScrollLock: true,
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    return (
      <div className="pivot-table-flex-container">
        <div className="estimate-table-flex-item">
          <FormControl fullWidth>
            <InputLabel id="rows-field-label">{'Rows'}</InputLabel>
            <Select
              sx={{
                height: 26,
                fontSize: '0.85rem'
              }}
              MenuProps={MenuProps}
              labelId="rows-field-label"
              id="rows-field-select"
              value={selectedPivottablesOptions?.rows || []}
              label={'Rows'}
              onChange={(event: SelectChangeEvent<string[]>) => {
                handleChangeOptions(event, 'row_vars', selectRowValue);
              }}
              name="row_vars"
            >
              {selectRowValue.map((option: EstimateRowVar, index: number) => (
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.rows}
                  sx={{
                    fontSize: '0.85rem'
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="estimate-table-flex-item">
          <FormControl fullWidth>
            <InputLabel id="columns-field-label">{'Columns'}</InputLabel>
            <Select
              sx={{
                height: 26,
                fontSize: '0.85rem'
              }}
              MenuProps={MenuProps}
              labelId="columns-field-label"
              id="columns-field-select"
              value={selectedPivottablesOptions?.column_vars || []}
              label={'Column'}
              onChange={(event: SelectChangeEvent<string[]>) => {
                handleChangeOptions(event, 'column_vars');
              }}
              name="column_vars"
            >
              {selectColumnValue.map((option: any, index: number) => {

                return (
                  <MenuItem
                    key={`${option.label}-${index}`}
                    value={option.cols.cols}
                    sx={{
                      fontSize: '0.85rem'
                    }}

                  >
                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="estimate-table-flex-item">
          <FormControl fullWidth>
            <InputLabel id="cells-field-label">{'Cells'}</InputLabel>
            <Select
              sx={{
                height: 26, fontSize: '0.85rem'
              }}
              MenuProps={MenuProps}
              labelId="cells-field-label"
              id="cells-field-select"
              value={selectedPivottablesOptions?.cell_vars || []}
              label={'Cells'}
              onChange={(event: SelectChangeEvent<string[]>) => {
                handleChangeOptions(event, 'cell_vars');
              }}
              name="cell_vars"
            >
              {selectCellValue.map((option: any, index: number) => (
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.vals}
                  sx={{
                    fontSize: '0.85rem'
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="estimate-table-flex-item">
          <div className="button-export-csv-estimate">
            <button
              onClick={handleButtonExportCSV}
              onMouseLeave={() => setMode('html')}
            >
              Download Table
            </button>
          </div>
        </div>
      </div>
    );
  };
