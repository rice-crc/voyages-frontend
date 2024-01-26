import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { FunctionComponent } from 'react';
import {
  PivotRowVar,
  PivotColumnVar,
  PivotCellVar,
  PivotTablesProps,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';

interface SelectDropdownPivotableProps {
  selectRowValue: PivotRowVar[];
  selectColumnValue: PivotColumnVar[];
  selectCellValue: PivotCellVar[];
  selectedPivottablesOptions: PivotTablesProps;
  handleChangeOptions: (event: SelectChangeEvent<string>, name: string, selectRowValue?: PivotRowVar[]) => void;
}

export const SelectDropdownPivotable: FunctionComponent<
  SelectDropdownPivotableProps
> = ({
  selectRowValue,
  selectColumnValue,
  selectCellValue,
  selectedPivottablesOptions,
  handleChangeOptions
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
        <div className="pivot-table-flex-item">
          <FormControl fullWidth>
            <InputLabel id="rows-field-label">{'Rows'}</InputLabel>
            <Select
              sx={{
                height: 42,
              }}
              MenuProps={MenuProps}
              labelId="rows-field-label"
              id="rows-field-select"
              value={selectedPivottablesOptions?.row_vars}
              label={'Rows'}
              onChange={(event: SelectChangeEvent<string>) => {
                handleChangeOptions(event, 'row_vars', selectRowValue);
              }}
              name="row_vars"
            >
              {selectRowValue.map((option: PivotRowVar, index: number) => (
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.rows}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="pivot-table-flex-item">
          <FormControl fullWidth>
            <InputLabel id="columns-field-label">{'Columns'}</InputLabel>
            <Select
              sx={{
                height: 42,
              }}
              MenuProps={MenuProps}
              labelId="columns-field-label"
              id="columns-field-select"
              value={selectedPivottablesOptions?.column_vars as any}
              label={'Column'}
              onChange={(event: SelectChangeEvent<string>) => {
                handleChangeOptions(event, 'column_vars');
              }}
              name="column_vars"
            >
              {selectColumnValue.map((option: any, index: number) => {
                return (
                  <MenuItem
                    key={`${option.label}-${index}`}
                    value={option.columns}
                  >
                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="pivot-table-flex-item">
          <FormControl fullWidth>
            <InputLabel id="cells-field-label">{'Cells'}</InputLabel>
            <Select
              sx={{
                height: 42,
              }}
              MenuProps={MenuProps}
              labelId="cells-field-label"
              id="cells-field-select"
              value={selectedPivottablesOptions?.cell_vars}
              label={'Cells'}
              onChange={(event: SelectChangeEvent<string>) => {
                handleChangeOptions(event, 'cell_vars');
              }}
              name="cell_vars"
            >
              {selectCellValue.map((option: any, index: number) => (
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.value_field}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    );
  };
