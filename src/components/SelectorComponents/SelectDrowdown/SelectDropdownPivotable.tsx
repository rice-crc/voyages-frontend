import { FunctionComponent } from 'react';

import { DownOutlined } from '@ant-design/icons';
import { Select, Row, Col } from 'antd';
import '@/style/table.scss';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import {
  PivotRowVar,
  PivotColumnVar,
  PivotCellVar,
  PivotTablesProps,
  LabelFilterMeneList,
} from '@/share/InterfaceTypes';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';

const { Option } = Select;

interface SelectDropdownPivotableProps {
  selectRowValue: PivotRowVar[];
  selectColumnValue: PivotColumnVar[];
  selectCellValue: PivotCellVar[];
  selectedPivottablesOptions: PivotTablesProps;
  handleChangeOptions: (
    value: string | string[],
    name: string,
    options?: PivotRowVar[] | PivotCellVar[],
  ) => void;
}

export const SelectDropdownPivotable: FunctionComponent<
  SelectDropdownPivotableProps
> = ({
  selectRowValue,
  selectColumnValue,
  selectCellValue,
  selectedPivottablesOptions,
  handleChangeOptions,
}) => {
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  const selectStyle = {
    height: 34,
    borderRadius: 4,
    width: 360,
    maxWidth: 400,
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 2,
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.025em',
  };

  // Helper function to compare arrays
  const arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  // Helper function to find the currently selected column option
  const getSelectedColumnValue = (): string => {
    const currentColumns = selectedPivottablesOptions?.column_vars;
    if (!currentColumns) return '';

    const foundOption = selectColumnValue.find((option) =>
      arraysEqual(option.columns, currentColumns),
    );

    return foundOption ? JSON.stringify(foundOption.columns) : '';
  };

  // Helper function to get current selected cell value (composite key)
  const getSelectedCellValue = (): string => {
    const { cell_vars, agg_fn } = selectedPivottablesOptions;
    return cell_vars && agg_fn ? `${cell_vars}|${agg_fn}` : '';
  };

  return (
    <Row gutter={[20, 16]} align="middle">
      <Col xs={24} sm={8}>
        <div>
          <label style={labelStyle}>
            {translatedEstimates.rowDropDownTitle}
          </label>
          <Select
            style={selectStyle}
            size="large"
            value={selectedPivottablesOptions?.row_vars}
            onChange={(value: string) => {
              handleChangeOptions(value, 'row_vars', selectRowValue);
            }}
            placeholder={`Select ${translatedEstimates.rowDropDownTitle.toLowerCase()}`}
            suffixIcon={<DownOutlined style={{ color: '#6b7280' }} />}
            popupMatchSelectWidth={false}
            classNames={{
              popup: { root: 'custom-select-dropdown' },
            }}
          >
            {selectRowValue.map((option: PivotRowVar, index: number) => {
              const rowLabel = (option.label as LabelFilterMeneList)[
                languageValue
              ];
              return (
                <Option key={`${rowLabel}-${index}`} value={option.rows}>
                  <div style={{ padding: '4px 0' }}>{rowLabel}</div>
                </Option>
              );
            })}
          </Select>
        </div>
      </Col>

      <Col xs={24} sm={8}>
        <div>
          <label style={labelStyle}>
            {translatedEstimates.columnsDropDownTitle}
          </label>
          <Select
            style={selectStyle}
            size="large"
            value={getSelectedColumnValue()}
            onChange={(value: string) => {
              const columnsArray = JSON.parse(value);
              handleChangeOptions(columnsArray, 'column_vars');
            }}
            placeholder={`Select ${translatedEstimates.columnsDropDownTitle.toLowerCase()}`}
            suffixIcon={<DownOutlined style={{ color: '#6b7280' }} />}
            popupMatchSelectWidth={false}
            classNames={{
              popup: { root: 'custom-select-dropdown-wide' },
            }}
          >
            {selectColumnValue.map((option: PivotColumnVar, index: number) => {
              const columnLabel = (option.label as LabelFilterMeneList)[
                languageValue
              ];
              const optionValue = JSON.stringify(option.columns);
              return (
                <Option key={`${optionValue}-${index}`} value={optionValue}>
                  <div style={{ padding: '4px 0' }}>{columnLabel}</div>
                </Option>
              );
            })}
          </Select>
        </div>
      </Col>

      <Col xs={24} sm={8}>
        <div>
          <label style={labelStyle}>
            {translatedEstimates.cellDropDownTitle}
          </label>
          <Select
            style={selectStyle}
            size="large"
            value={getSelectedCellValue()}
            onChange={(value: string) => {
              handleChangeOptions(value, 'cell_vars', selectCellValue);
            }}
            placeholder={`Select ${translatedEstimates.cellDropDownTitle.toLowerCase()}`}
            suffixIcon={<DownOutlined style={{ color: '#6b7280' }} />}
            popupMatchSelectWidth={false}
            classNames={{
              popup: { root: 'custom-select-dropdown' },
            }}
          >
            {selectCellValue.map((option: PivotCellVar, index: number) => {
              const cellLabel = (option.label as LabelFilterMeneList)[
                languageValue
              ];
              // Create composite key combining value_field and agg_fn
              const optionValue = `${option.value_field}|${option.agg_fn}`;

              return (
                <Option key={`${optionValue}-${index}`} value={optionValue}>
                  <div style={{ padding: '4px 0' }}>{cellLabel}</div>
                </Option>
              );
            })}
          </Select>
        </div>
      </Col>
    </Row>
  );
};
