import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ChangeEvent, FunctionComponent } from "react";
import { PlotXYVar, voygOption } from "../../../share/InterfaceTypes";
interface SelectDropDownXYProps {
  selectedX: PlotXYVar[];
  selectedY: PlotXYVar[];
  voyageOption: voygOption;
  handleChange: (event: ChangeEvent<HTMLSelectElement>, name: string) => void;
  width: number;
}

const SelectDropDownXY: FunctionComponent<SelectDropDownXYProps> = (props) => {
  const { selectedX, selectedY, voyageOption, handleChange, width } = props;
  return (
    <div>
      <Box sx={{ maxWidth: width > 500 ? width * 0.9 : width * 0.7 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">X Field</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={voyageOption.x_vars}
            label="X Field"
            onChange={(event: any) => {
              handleChange(event, "x_vars");
            }}
            name="x_vars"
          >
            {selectedX.map((option: PlotXYVar, index: number) => (
              <MenuItem key={`${option.label}-${index}`}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ maxWidth: width > 500 ? width * 0.9 : width * 0.7, my: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Y Field</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={voyageOption.y_vars}
            label="Y Field"
            onChange={(event: any) => {
              handleChange(event, "y_vars");
            }}
            name="y_vars"
          >
            {selectedY.map((option: PlotXYVar, index: number) => (
              <MenuItem key={`${option.label}-${index}`}>
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
