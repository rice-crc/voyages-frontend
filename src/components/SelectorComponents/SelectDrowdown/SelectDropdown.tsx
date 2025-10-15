import { FunctionComponent, ReactNode } from 'react';

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import {
  PlotXYVar,
  VoyagesOptionProps,
  LanguageKey,
} from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';

interface SelectDropdownProps {
  selectedX: PlotXYVar[];
  selectedY: PlotXYVar[];
  chips?: string[];
  selectedOptions: VoyagesOptionProps;
  handleChange: (event: SelectChangeEvent<string>, name: string) => void;
  handleChangeMultipleYSelected?: (
    event: SelectChangeEvent<string[]>,
    name: string,
  ) => void;
  maxWidth?: number;
  XFieldText?: string;
  YFieldText?: string;
  graphType?: string;
  setXAxes?: React.Dispatch<React.SetStateAction<string>>;
  setYAxes?: React.Dispatch<React.SetStateAction<string[]>>;
  setYAxesPie?: React.Dispatch<React.SetStateAction<string>>;
  error?: boolean;
}

export const SelectDropdown: FunctionComponent<SelectDropdownProps> = ({
  selectedX,
  selectedY,
  graphType,
  chips,
  error,
  selectedOptions,
  handleChange,
  handleChangeMultipleYSelected,
  maxWidth,
  XFieldText,
  YFieldText,
  setXAxes,
  setYAxes,
  setYAxesPie,
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
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection,
  );
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const lang = languageValue as LanguageKey;

  const isDisabledX = (option: PlotXYVar) => {
    return option.var_name === selectedOptions.y_vars;
  };

  const isDisabledY = (option: PlotXYVar) => {
    return option.var_name === selectedOptions.x_vars;
  };

  const xVarOptions = selectedX.map((option) => option.var_name);
  const xVarValue = xVarOptions.includes(selectedOptions.x_vars)
    ? selectedOptions.x_vars
    : '';

  return (
    <>
      <Box sx={{ maxWidth, my: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="x-field-label" style={{ color: '#000' }}>
            {XFieldText}
          </InputLabel>
          <Select
            sx={{
              height: 36,
              fontSize: '0.95rem',
              color: '#000',
            }}
            MenuProps={{
              disableScrollLock: true,
              PaperProps: {
                sx: {
                  height: 380,
                  '& .MuiMenuItem-root': {
                    padding: 2,
                  },
                },
              },
            }}
            labelId="x-field-label"
            id="x-field-select"
            value={xVarValue}
            label={<span style={{ fontSize: '0.85rem' }}>{XFieldText}</span>}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, 'x_vars');
              const selectedOption = selectedX.find(
                (option) => option.var_name === event.target.value,
              );
              if (setXAxes) {
                setXAxes(selectedOption ? selectedOption.label[lang] : '');
              }
            }}
            name="x_vars"
          >
            {selectedX.map((option: PlotXYVar, index: number) => {
              return (
                <MenuItem
                  key={`${option.label[lang]}-${index}`}
                  value={option.var_name}
                  title={option.label[lang]}
                  disabled={isDisabledX(option)}
                >
                  {option.label[lang]}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      {graphType !== 'PIE' ? (
        <Box sx={{ maxWidth, my: 2 }}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-multiple-chip-label"
              style={{ color: chips?.length === 0 && error ? 'red' : '#000' }}
            >
              {chips?.length === 0 && error
                ? "Value can't be empty"
                : YFieldText}
            </InputLabel>
            <Select
              MenuProps={MenuProps}
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              label={YFieldText}
              value={chips}
              name="y_vars"
              onChange={(event: SelectChangeEvent<string[]>) => {
                if (handleChangeMultipleYSelected) {
                  handleChangeMultipleYSelected(event, 'y_vars');
                  const value = event.target.value;
                  const valueArray =
                    typeof value === 'string' ? value.split(',') : value;
                  const selectedYOptions = valueArray
                    .map((chipValue: string) => {
                      const [varName, aggFn] = chipValue.split('__AGG__');
                      const option = selectedY.find(
                        (opt) =>
                          opt.var_name === varName && opt.agg_fn === aggFn,
                      );
                      return option ? option.label[lang] : '';
                    })
                    .filter((label: string) => label !== '');
                  if (setYAxes) {
                    setYAxes(selectedYOptions);
                  }
                }
              }}
              input={
                <OutlinedInput id="select-multiple-chip" label={YFieldText} />
              }
              renderValue={(value): ReactNode => (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    color: 'red',
                    fontSize: '0.75rem',
                  }}
                >
                  {value.map((chipValue: string, index: number) => {
                    // CHANGED: Parse combined identifier to find option
                    const [varName, aggFn] = chipValue.split('__AGG__');
                    const selectedOption = selectedY.find(
                      (item) =>
                        item.var_name === varName && item.agg_fn === aggFn,
                    );
                    return (
                      <Chip
                        style={{
                          margin: 2,
                          border: getBoderColor(styleName),
                          color: '#000',
                        }}
                        key={`${chipValue}-${index}`}
                        label={selectedOption ? selectedOption.label[lang] : ''}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {selectedY.map((option: PlotXYVar, index: number) => {
                // CHANGED: Create unique value combining var_name and agg_fn
                const uniqueValue = `${option.var_name}__AGG__${option.agg_fn}`;
                const label = option.label[lang];
                return (
                  <MenuItem
                    key={`${uniqueValue}-${index}`}
                    value={uniqueValue}
                    disabled={isDisabledY(option)}
                  >
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" style={{ color: '#000' }}>
            {YFieldText}
          </InputLabel>
          <Select
            sx={{
              height: 36,
              fontSize: '0.95rem',
              color: '#000',
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  height: 380,
                  '& .MuiMenuItem-root': {
                    padding: 2,
                  },
                },
              },
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOptions.y_vars}
            label={XFieldText}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, 'y_vars');
              const selectYoption = selectedY.find(
                (option) => option.var_name === event.target.value,
              );
              if (setYAxesPie) {
                setYAxesPie(selectYoption ? selectYoption.label[lang] : '');
              }
            }}
            name="y_vars"
          >
            {selectedY.map((option: PlotXYVar, index: number) => (
              <MenuItem
                key={`${option.label[lang]}-${index}`}
                value={option.var_name}
                disabled={isDisabledY(option)}
              >
                {option.label[lang]}
              </MenuItem>
            ))}
          </Select>
          {chips?.length === 0 && error && (
            <Box sx={{ maxWidth, my: 2, color: 'red', fontSize: '0.75rem' }}>
              Value can not be empty
            </Box>
          )}
        </FormControl>
      )}
    </>
  );
};
