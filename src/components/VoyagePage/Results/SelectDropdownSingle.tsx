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
  selectedOptions: VoyagesOptionProps;
  handleChange: (event: SelectChangeEvent<string>, name: string) => void;
  maxWidth?: number;
  XFieldText?: string;
  YFieldText?: string;
  graphType?: string;
}

const SelectDropDownXY: FunctionComponent<SelectDropDownXYProps> = (props) => {
  const {
    selectedX,
    XFieldText,
    YFieldText,
    selectedY,
    selectedOptions,
    handleChange,
    maxWidth,
  } = props;

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
          <InputLabel id="x-field-label">{XFieldText}</InputLabel>
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
            label={XFieldText}
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
          <InputLabel id="demo-simple-select-label">{XFieldText}</InputLabel>
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
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOptions.y_vars}
            label={XFieldText}
            onChange={(event: SelectChangeEvent<string>) => {
              handleChange(event, "y_vars");
            }}
            name="y_vars"
          >
            {selectedY.map((option: PlotXYVar, index: number) => (
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
    </div>
  );
};
export default SelectDropDownXY;
