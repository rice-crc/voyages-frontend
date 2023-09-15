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
import { FunctionComponent, ReactNode } from 'react';
import { PlotXYVar, VoyagesOptionProps } from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SelectDropdownScatterProps {
  selectedX: PlotXYVar[];
  selectedY: PlotXYVar[];
  chips?: string[];
  selectedOptions: VoyagesOptionProps;
  handleChange: (event: SelectChangeEvent<string>, name: string) => void;
  handleChangeMultipleYSelected: (
    event: SelectChangeEvent<string[]>,
    name: string
  ) => void;
  maxWidth?: number;
  XFieldText?: string;
  YFieldText?: string;
  optionsFlatY: PlotXYVar[];
  graphType?: string;
}

export const SelectDropdown: FunctionComponent<SelectDropdownScatterProps> = ({
  selectedX,
  selectedY,
  graphType,
  chips,
  selectedOptions,
  handleChange,
  handleChangeMultipleYSelected,
  maxWidth,
  XFieldText,
  YFieldText,
  optionsFlatY,
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
    (state: RootState) => state.getDataSetCollection
  );

  const isDisabledX = (option: PlotXYVar) => {
    return option.var_name === selectedOptions.y_vars;
  };

  const isDisabledY = (option: PlotXYVar) => {
    return option.var_name === selectedOptions.x_vars;
  };

  return (
    <div>
      <Box sx={{ maxWidth, my: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="x-field-label">{XFieldText}</InputLabel>
          <Select
            sx={{
              height: 42,
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
            value={selectedOptions.x_vars}
            label={XFieldText}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, 'x_vars');
            }}
            name="x_vars"
          >
            {selectedX.map((option: PlotXYVar, index: number) => {
              return (
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.var_name}
                  disabled={isDisabledX(option)}
                >
                  {option.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      {graphType !== 'PIE' ? (
        <Box sx={{ maxWidth, my: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">{YFieldText}</InputLabel>
            <Select
              MenuProps={MenuProps}
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              label={YFieldText}
              value={chips}
              name="y_vars"
              onChange={(event: SelectChangeEvent<string[]>) => {
                handleChangeMultipleYSelected(event, 'y_vars');
              }}
              input={
                <OutlinedInput id="select-multiple-chip" label={YFieldText} />
              }
              renderValue={(value): ReactNode => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {value.map((option: string, index: number) => (
                    <Chip
                      style={{
                        margin: 2,
                        border: getBoderColor(styleName),
                      }}
                      key={`${option}-${index}`}
                      label={optionsFlatY[index].label}
                    />
                  ))}
                </Box>
              )}
            >
              {selectedY.map((option: PlotXYVar, index: number) => (
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.var_name}
                  disabled={isDisabledY(option)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box sx={{ maxWidth, my: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{YFieldText}</InputLabel>
            <Select
              sx={{
                height: 42,
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
              }}
              name="y_vars"
            >
              {selectedY.map((option: PlotXYVar, index: number) => (
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.var_name}
                  disabled={isDisabledY(option)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </div>
  );
};
