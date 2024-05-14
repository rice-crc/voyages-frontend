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

interface SelectSearchDropdownEnslaversNameRoleProps {
  selectedX?: PlotXYVar[];
  selectedY?: PlotXYVar[];
  chips?: string[];
  selectedOptions?: VoyagesOptionProps;
  handleChange?: (event: SelectChangeEvent<string>, name: string) => void;
  handleChangeMultipleYSelected?: (
    event: SelectChangeEvent<string[]>,
    name: string
  ) => void;
  aggregation?: string
  maxWidth?: number;
  XFieldText?: string;
  YFieldText?: string;
  error?: boolean
}

export const SelectSearchDropdownEnslaversNameRole: FunctionComponent<SelectSearchDropdownEnslaversNameRoleProps> = ({
  selectedX,
  selectedY,
  chips, error,
  selectedOptions,
  handleChange,
  handleChangeMultipleYSelected,
  maxWidth,
  XFieldText, aggregation,
  YFieldText,
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
    return option.var_name === selectedOptions?.y_vars;
  };

  const isDisabledY = (option: PlotXYVar) => {
    return option.var_name === selectedOptions?.x_vars;
  };

  return (
    <>
      <Box sx={{ maxWidth, my: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-chip-label" style={{ color: chips?.length === 0 && error ? "red" : '#000' }}>{chips?.length === 0 && error ? "Value can't be empty" : YFieldText}</InputLabel>
          <Select
            MenuProps={MenuProps}
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            label={YFieldText}
            value={chips}
            name="y_vars"
            // onChange={(event: SelectChangeEvent<string[]>) => {
            //   if (handleChangeMultipleYSelected) {
            //     handleChangeMultipleYSelected(event, 'y_vars');
            //     const selectedYOptions = selectedY
            //       .filter(option => event.target.value.includes(option.var_name))
            //       .map(option => option.label);
            //     setYAxes && setYAxes(selectedYOptions);
            //   }
            // }}
            input={
              <OutlinedInput id="select-multiple-chip" label={YFieldText} />
            }
            renderValue={(value): ReactNode => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', color: 'red', fontSize: '0.75rem' }}>
                {value.map((option: string, index: number) => {
                  const selectedOption = selectedY?.find((item) => item.var_name === option);
                  return (
                    <Chip
                      style={{
                        margin: 2,
                        border: getBoderColor(styleName),
                        color: '#000',
                      }}
                      key={`${option}-${index}`}
                      label={selectedOption ? selectedOption.label : ''}
                    />
                  );
                })}
              </Box>
            )}
          >
            {selectedY?.map((option: PlotXYVar, index: number) => {
              const label = displayYLabel(aggregation!, option.agg_fns!, option.label)
              return label !== null &&
                <MenuItem
                  key={`${option.label}-${index}`}
                  value={option.var_name}
                  disabled={isDisabledY(option)}
                >
                  {label}
                </MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>

    </>
  );
};

// Create label Y depending on sum or mean to display
const displayYLabel = (aggregation: string, agg_fns: string[], label: string) => {
  let yLabel = null;
  if (aggregation === 'sum' && agg_fns!.includes('sum') && agg_fns!.includes('mean')) {
    yLabel = label
  } else if (aggregation === 'sum' && agg_fns!.includes('sum')) {
    yLabel = label
  } else if (aggregation === 'mean' && agg_fns!.includes('mean')) {
    yLabel = label
  }
  return yLabel
}