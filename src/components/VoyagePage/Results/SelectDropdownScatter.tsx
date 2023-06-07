import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FunctionComponent } from "react";
import { PlotXYVar, VoyagesOptionProps } from "@/share/InterfaceTypes";

interface SelectDropdownScatterProps {
  selectedX: PlotXYVar[];
  selectedY: PlotXYVar[];
  selectedOptions: VoyagesOptionProps;
  handleChange: (event: SelectChangeEvent<string>, name: string) => void;
  maxWidth?: number;
}

const SelectDropdownScatter: FunctionComponent<SelectDropdownScatterProps> = ({
  selectedX,
  selectedY,
  selectedOptions,
  handleChange,
  maxWidth,
}) => {
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
            style={{ fontSize: 18, fontWeight: 600 }}
          >
            X Field
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
            style={{ fontSize: 18, fontWeight: 600 }}
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
                style={{ fontSize: 18, fontWeight: 600 }}
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
            id="y-field-label"
            style={{ fontSize: 18, fontWeight: 600 }}
          >
            Y Field
          </InputLabel>
          <Select
            sx={{
              height: 42,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  height: 365,
                },
              },
            }}
            labelId="y-field-label"
            id="y-field-select"
            value={selectedOptions.y_vars}
            label="Y Field"
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, "y_vars");
            }}
            name="y_vars"
            style={{ fontSize: 18, fontWeight: 600 }}
          >
            {selectedY.map((option: PlotXYVar, index: number) => (
              <MenuItem
                key={`${option.label}-${index}`}
                value={option.var_name}
                disabled={isDisabledY(option)}
                style={{ fontSize: 18, fontWeight: 600 }}
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

export default SelectDropdownScatter;
