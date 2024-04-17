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
import {
  PlotXYVar,
  VoyagesOptionProps,
} from '@/share/InterfaceTypes';
import { getBoderColor } from '@/utils/functions/getColorStyle';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SelectDropdownProps {
  selectedX: PlotXYVar[];
  selectedY: PlotXYVar[];
  chips?: string[];
  selectedOptions: VoyagesOptionProps;
  handleChange: (event: SelectChangeEvent<string>, name: string) => void;
  handleChangeMultipleYSelected?: (
    event: SelectChangeEvent<string[]>,
    name: string
  ) => void;
  maxWidth?: number;
  XFieldText?: string;
  YFieldText?: string;
  optionsFlatY: PlotXYVar[];
  graphType?: string;
  setXAxes?: React.Dispatch<React.SetStateAction<string>>
  setYAxes?: React.Dispatch<React.SetStateAction<string[]>>
}

export const SelectDropdown: FunctionComponent<SelectDropdownProps> = ({
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
  optionsFlatY, setXAxes, setYAxes
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
    <>
      <Box sx={{ maxWidth, my: 4 }} >
        <FormControl fullWidth>
          <InputLabel id="x-field-label" style={{ color: '#000' }}>{XFieldText}</InputLabel>
          <Select
            sx={{
              height: 36,
              fontSize: '0.95rem',
              color: '#000'
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
            label={<span style={{ fontSize: '0.85rem' }}>{XFieldText}</span>}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, 'x_vars');
              const selectedOption = selectedX.find(option => option.var_name === event.target.value);
              setXAxes && setXAxes(selectedOption ? selectedOption.label : '');
            }}
            name="x_vars"
          >
            {selectedX.map((option: PlotXYVar, index: number) => {
              return (
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.var_name}
                  title={option.label}
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
            <InputLabel id="demo-multiple-chip-label" style={{ color: '#000' }}>{YFieldText}</InputLabel>
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

                  const selectedOptions = selectedY
                    .filter(option => event.target.value.includes(option.var_name))
                    .map(option => option.label);

                  setYAxes && setYAxes(selectedOptions);
                }
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
                        color: '#000'
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
            <InputLabel id="demo-simple-select-label" style={{ color: '#000' }}>{YFieldText}</InputLabel>
            <Select
              sx={{
                height: 36,
                fontSize: '0.95rem',
                color: '#000'
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
    </>
  );
};
