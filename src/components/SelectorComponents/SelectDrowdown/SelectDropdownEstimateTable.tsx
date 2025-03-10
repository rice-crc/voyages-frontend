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
  LabelFilterMeneList,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';

interface SelectDropdownEstimateTableProps {
  selectRowValue: EstimateRowVar[];
  selectColumnValue: EstimateColumnVar[];
  selectCellValue: EstimateCellVar[];
  selectedEstimateTablesOptions: EstimateOptionProps;
  handleChangeOptions: (
    event: SelectChangeEvent<string[]>,
    name: string,
    selectRowValue?: EstimateRowVar[]
  ) => void;
  handleButtonExportCSV: () => void;
}

export const SelectDropdownEstimateTable: FunctionComponent<
  SelectDropdownEstimateTableProps
> = ({
  selectRowValue,
  selectColumnValue,
  selectCellValue,
  selectedEstimateTablesOptions,
  handleChangeOptions,
  handleButtonExportCSV,
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const MenuProps = {
    disableScrollLock: true,
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  return (
    <div className="pivot-table-flex-container">
      <div className="estimate-table-flex-item">
        <FormControl fullWidth>
          <InputLabel id="rows-field-label">
            {translatedEstimates.rowDropDownTitle}
          </InputLabel>
          <Select
            sx={{
              height: 26,
              fontSize: '0.85rem',
            }}
            MenuProps={MenuProps}
            labelId="rows-field-label"
            id="rows-field-select"
            value={selectedEstimateTablesOptions?.rows || []}
            label={translatedEstimates.rowDropDownTitle}
            onChange={(event: SelectChangeEvent<string[]>) => {
              handleChangeOptions(event, 'row_vars', selectRowValue);
            }}
            name="row_vars"
          >
            {selectRowValue.map((option: EstimateRowVar, index: number) => {
              const rowLabel = (option.label as LabelFilterMeneList)[
                languageValue
              ];
              return (
                <MenuItem
                  key={`${rowLabel}-${index}`}
                  value={option.rows as string[]}
                  sx={{
                    fontSize: '0.85rem',
                  }}
                >
                  {rowLabel}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <div className="estimate-table-flex-item">
        <FormControl fullWidth>
          <InputLabel id="columns-field-label">
            {translatedEstimates.columnsDropDownTitle}
          </InputLabel>
          <Select
            sx={{
              height: 26,
              fontSize: '0.85rem',
            }}
            MenuProps={MenuProps}
            labelId="columns-field-label"
            id="columns-field-select"
            value={selectedEstimateTablesOptions?.column_vars || []}
            label={translatedEstimates.columnsDropDownTitle}
            onChange={(event: SelectChangeEvent<string[]>) => {
              handleChangeOptions(event, 'column_vars');
            }}
            name="column_vars"
          >
            {selectColumnValue.map((option: any, index: number) => {
              const columnLabel = (option.label as LabelFilterMeneList)[
                languageValue
              ];
              return (
                <MenuItem
                  key={`${columnLabel}-${index}`}
                  value={option.cols.cols}
                  sx={{
                    fontSize: '0.85rem',
                  }}
                >
                  {columnLabel}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <div className="estimate-table-flex-item">
        <FormControl fullWidth>
          <InputLabel id="cells-field-label">
            {translatedEstimates.cellDropDownTitle}
          </InputLabel>
          <Select
            sx={{
              height: 26,
              fontSize: '0.85rem',
            }}
            MenuProps={MenuProps}
            labelId="cells-field-label"
            id="cells-field-select"
            value={selectedEstimateTablesOptions?.cell_vars || []}
            label={translatedEstimates.cellDropDownTitle}
            onChange={(event: SelectChangeEvent<string[]>) => {
              handleChangeOptions(event, 'cell_vars');
            }}
            name="cell_vars"
          >
            {selectCellValue.map((option: any, index: number) => {
              const cellLabel = (option.label as LabelFilterMeneList)[
                languageValue
              ];
              return (
                <MenuItem
                  key={`${cellLabel}-${index}`}
                  value={option.vals}
                  sx={{
                    fontSize: '0.85rem',
                  }}
                >
                  {cellLabel}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <div className="estimate-table-flex-item">
        <div className="button-export-csv-estimate">
          <button onClick={handleButtonExportCSV}>
            {translatedEstimates.downloadTable}
          </button>
        </div>
      </div>
    </div>
  );
};
