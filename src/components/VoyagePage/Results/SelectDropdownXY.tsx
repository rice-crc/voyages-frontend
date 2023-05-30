import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FunctionComponent } from "react";
import { PlotXYVar, VoyagesOptionProps } from "../../../share/InterfaceTypes";

interface SelectDropDownXYProps {
  selectedX: PlotXYVar[];
  selectedY: PlotXYVar[];
  voyageOption: VoyagesOptionProps;
  handleChange: (event: SelectChangeEvent<string>, name: string) => void;
  width: number;
}

const SelectDropDownXY: FunctionComponent<SelectDropDownXYProps> = ({
  selectedX,
  selectedY,
  voyageOption,
  handleChange,
  width,
}) => {
  const maxWidth = width > 500 ? width * 0.9 : width * 0.7;

  const isDisabledX = (option: PlotXYVar) => {
    return option.var_name === voyageOption.y_vars;
  };
  const isDisabledY = (option: PlotXYVar) => {
    return option.var_name === voyageOption.x_vars;
  };

  return (
    <div>
      <Box sx={{ maxWidth }}>
        <FormControl fullWidth>
          <InputLabel id="x-field-label">X Field</InputLabel>
          <Select
            labelId="x-field-label"
            id="x-field-select"
            value={voyageOption.x_vars}
            label="X Field"
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
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ maxWidth, my: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="y-field-label">Y Field</InputLabel>
          <Select
            labelId="y-field-label"
            id="y-field-select"
            value={voyageOption.y_vars}
            label="Y Field"
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, "y_vars");
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
    </div>
  );
};

export default SelectDropDownXY;
