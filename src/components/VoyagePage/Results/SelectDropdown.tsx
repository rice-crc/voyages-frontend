import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { FunctionComponent, ReactNode } from "react";
import { PlotXYVar, VoyagesOptionProps } from "@/share/InterfaceTypes";

interface SelectDropdownScatterProps {
  selectedX: PlotXYVar[];
  selectedY: PlotXYVar[];
  chips: string[];
  selectedOptions: VoyagesOptionProps;
  handleChange: (event: SelectChangeEvent<string>, name: string) => void;
  handleChangeChipYSelected: (
    event: SelectChangeEvent<string[]>,
    name: string
  ) => void;
  maxWidth?: number;
  XFieldText?: string;
  YFieldText?: string;
  optionsFlatY: PlotXYVar[];
}

export const SelectDropdown: FunctionComponent<SelectDropdownScatterProps> = ({
  selectedX,
  selectedY,
  chips,
  selectedOptions,
  handleChange,
  handleChangeChipYSelected,
  maxWidth,
  XFieldText,
  YFieldText,
  optionsFlatY,
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
          <InputLabel
            id="x-field-label"
            style={{ fontSize: 16, fontWeight: 600 }}
          >
            {XFieldText}
          </InputLabel>
          <Select
            sx={{
              height: 42,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  height: 380,
                  "& .MuiMenuItem-root": {
                    padding: 2,
                  },
                },
              },
            }}
            labelId="x-field-label"
            id="x-field-select"
            value={selectedOptions.x_vars}
            label="X Field"
            style={{ fontSize: 16, fontWeight: 600 }}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, "x_vars");
            }}
            name="x_vars"
          >
            {selectedX.map((option: PlotXYVar, index: number) => (
              <MenuItem
                key={`${option.label}-${index}`}
                value={option.var_name}
                disabled={isDisabledX(option)}
                style={{ fontSize: 16, fontWeight: 600 }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ maxWidth, my: 2 }}>
        <FormControl fullWidth>
          <InputLabel
            id="demo-multiple-chip-label"
            style={{ fontSize: 16, fontWeight: 600 }}
          >
            {YFieldText}
          </InputLabel>
          <Select
            MenuProps={MenuProps}
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            label={YFieldText}
            style={{ fontSize: 16, fontWeight: 600 }}
            value={chips}
            onChange={(event: SelectChangeEvent<string[]>) => {
              handleChangeChipYSelected(event, "y_vars");
            }}
            input={
              <OutlinedInput id="select-multiple-chip" label={YFieldText} />
            }
            renderValue={(value): ReactNode => (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {value.map((option: string, index: number) => (
                  <Chip
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      margin: 2,
                      border: "1px solid #54bfb6",
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
                style={{ fontSize: 16, fontWeight: 600 }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};
