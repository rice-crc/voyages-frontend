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
  LabelFilterMeneList,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';

interface SelectDropdownPivotableProps {
  selectRowValue: PivotRowVar[];
  selectColumnValue: PivotColumnVar[];
  selectCellValue: PivotCellVar[];
  selectedPivottablesOptions: PivotTablesProps;
  handleChangeOptions: (
    event: SelectChangeEvent<string>,
    name: string,
    selectRowValue?: PivotRowVar[]
  ) => void;
  aggregation: string;
}

export const SelectDropdownPivotable: FunctionComponent<
  SelectDropdownPivotableProps
> = ({
  selectRowValue,
  selectColumnValue,
  selectCellValue,
  selectedPivottablesOptions,
  handleChangeOptions,
  aggregation,
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

  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );

  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  return (
    <div className="pivot-table-flex-container">
      <div className="pivot-table-flex-item">
        <FormControl fullWidth>
          <InputLabel id="rows-field-label" style={{ color: '#000' }}>
            {translatedEstimates.rowDropDownTitle}
          </InputLabel>
          <Select
            sx={{
              height: 36,
              fontSize: '0.95rem',
              color: '#000',
            }}
            MenuProps={MenuProps}
            labelId="rows-field-label"
            id="rows-field-select"
            value={selectedPivottablesOptions?.row_vars}
            label={translatedEstimates.rowDropDownTitle}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChangeOptions(event, 'row_vars', selectRowValue);
            }}
            name="row_vars"
          >
            {selectRowValue.map((option: PivotRowVar, index: number) => {
              const rowLabel = (option.label as LabelFilterMeneList)[
                languageValue
              ];
              return (
                <MenuItem key={`${rowLabel}-${index}`} value={option.rows}>
                  {rowLabel}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <div className="pivot-table-flex-item">
        <FormControl fullWidth>
          <InputLabel id="columns-field-label" style={{ color: '#000' }}>
            {translatedEstimates.columnsDropDownTitle}
          </InputLabel>
          <Select
            sx={{
              height: 36,
              fontSize: '0.95rem',
              color: '#000',
            }}
            MenuProps={MenuProps}
            labelId="columns-field-label"
            id="columns-field-select"
            value={selectedPivottablesOptions?.column_vars as any}
            label={translatedEstimates.columnsDropDownTitle}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChangeOptions(event, 'column_vars');
            }}
            name="column_vars"
          >
            {selectColumnValue.map((option: any, index: number) => {
              const columnLabel = (option.label as LabelFilterMeneList)[
                languageValue
              ];
              return (
                <MenuItem key={`$columnLabel}-${index}`} value={option.columns}>
                  {columnLabel}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <div className="pivot-table-flex-item">
        <FormControl fullWidth>
          <InputLabel id="cells-field-label" style={{ color: '#000' }}>
            {translatedEstimates.cellDropDownTitle}
          </InputLabel>
          <Select
            sx={{
              height: 36,
              fontSize: '0.95rem',
              color: '#000',
            }}
            MenuProps={MenuProps}
            labelId="cells-field-label"
            id="cells-field-select"
            value={selectedPivottablesOptions?.cell_vars}
            label={translatedEstimates.cellDropDownTitle}
            onChange={(event: SelectChangeEvent<string>) => {
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
                  value={option.value_field}
                >
                  {cellLabel}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};
