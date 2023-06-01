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

interface SelectDropDownXYProps {
  scatterSelectedX: PlotXYVar[];
  scatterSelectedY: PlotXYVar[];
  scatterOptions: VoyagesOptionProps;
  handleChange: (event: SelectChangeEvent<string>, name: string) => void;
  width: number;
}

const SelectDropDownXY: FunctionComponent<SelectDropDownXYProps> = ({
  scatterSelectedX,
  scatterSelectedY,
  scatterOptions,
  handleChange,
  width,
}) => {
  const maxWidth = width > 600 ? width * 0.8 : width * 0.7;

  const isDisabledX = (option: PlotXYVar) => {
    return option.var_name === scatterOptions.y_vars;
  };
  const isDisabledY = (option: PlotXYVar) => {
    return option.var_name === scatterOptions.x_vars;
  };

  return (
    <div>
      <Box sx={{ maxWidth, my: 4 }}>
        <FormControl fullWidth>
          <InputLabel
            id="x-field-label"
            style={{ fontSize: 20, fontWeight: 600 }}
          >
            X Field
          </InputLabel>
          <Select
            labelId="x-field-label"
            id="x-field-select"
            value={scatterOptions.x_vars}
            label="X Field"
            style={{ fontSize: 20, fontWeight: 600 }}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, "x_vars");
            }}
            name="x_vars"
          >
            {scatterSelectedX.map((option: PlotXYVar, index: number) => (
              <MenuItem
                key={`${option.label}-${index}`}
                value={option.var_name}
                disabled={isDisabledX(option)}
                style={{ fontSize: 20, fontWeight: 600 }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ maxWidth, my: 4 }}>
        <FormControl fullWidth>
          <InputLabel
            id="y-field-label"
            style={{ fontSize: 20, fontWeight: 600 }}
          >
            Y Field
          </InputLabel>
          <Select
            labelId="y-field-label"
            id="y-field-select"
            value={scatterOptions.y_vars}
            label="Y Field"
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, "y_vars");
            }}
            name="y_vars"
            style={{ fontSize: 18, fontWeight: 600 }}
          >
            {scatterSelectedY.map((option: PlotXYVar, index: number) => (
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

export default SelectDropDownXY;
