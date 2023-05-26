import {
  Alert,
  AlertTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ChangeEvent, FunctionComponent } from "react";
import { Options, VoyagesOptionProps } from "../../../share/InterfaceTypes";
interface AggregationSumAverageProps {
  showAlert: boolean;
  aggregation: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  optionFlat: Options;
  voyageOption: VoyagesOptionProps;
}
const AggregationSumAverage: FunctionComponent<AggregationSumAverageProps> = (
  props
) => {
  const { showAlert, aggregation, optionFlat, handleChange, voyageOption } =
    props;

  const alertBar = () => {
    if (showAlert) {
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <AlertTitle>
            Sorry, these particular variables don't graph well together:
          </AlertTitle>
          <AlertTitle>
            The {aggregation} of {optionFlat[voyageOption.x_vars]?.label || ""},{" "}
            {optionFlat[voyageOption.y_vars]?.label || ""} Pie Graph
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
