import {
  Alert,
  AlertTitle,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { ChangeEvent, FunctionComponent } from "react";
interface AggregationSumAverageProps {
  showAlert: boolean;
  aggregation: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
}
const AggregationSumAverage: FunctionComponent<AggregationSumAverageProps> = (
  props
) => {
  const { showAlert, aggregation, handleChange } = props;

  const alertBar = () => {
    if (showAlert) {
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <AlertTitle>
            Sorry, these particular variables don't graph well together:
          </AlertTitle>
          <AlertTitle>
            {/* The {aggregation} of {options_flat[option.field].flatlabel}, {options_flat[option.value].flatlabel} Pie */}
            Graph
          </AlertTitle>
        </Alert>
      );
    } else {
      return "";
    }
  };
  return (
    <div>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">
          Aggregation Function
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={aggregation}
          onChange={handleChange}
          row
        >
          <FormControlLabel value="sum" control={<Radio />} label="Sum" />
          <FormControlLabel value="mean" control={<Radio />} label="Average" />
        </RadioGroup>
      </FormControl>
      {alertBar()}
    </div>
  );
};

export default AggregationSumAverage;
