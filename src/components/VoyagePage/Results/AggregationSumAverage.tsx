import {
  Alert,
  AlertTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { ChangeEvent, FunctionComponent } from "react";
import { Options, VoyagesOptionProps } from "@/share/InterfaceTypes";
interface AggregationSumAverageProps {
  showAlert: boolean;
  aggregation: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  optionFlat: Options;
  scatterOptions: VoyagesOptionProps;
}
const AggregationSumAverage: FunctionComponent<AggregationSumAverageProps> = (
  props
) => {
  const { showAlert, aggregation, optionFlat, handleChange, scatterOptions } =
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
            The {aggregation} of{" "}
            {optionFlat[scatterOptions.x_vars]?.label || ""},{" "}
            {optionFlat[scatterOptions.y_vars]?.label || ""} Pie Graph
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
        <FormLabel
          id="demo-controlled-radio-buttons-group"
          style={{ fontSize: 20, fontWeight: 600 }}
        >
          Aggregation Function
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={aggregation}
          onChange={handleChange}
          row
        >
          <FormControlLabel
            value="sum"
            control={<Radio />}
            label={
              <Typography
                variant="body1"
                style={{ fontSize: 20, fontWeight: 500 }}
              >
                Sum
              </Typography>
            }
          />
          <FormControlLabel
            value="mean"
            control={<Radio />}
            label={
              <Typography
                variant="body1"
                style={{ fontSize: 20, fontWeight: 500 }}
              >
                Average
              </Typography>
            }
          />
        </RadioGroup>
      </FormControl>
      {alertBar()}
    </div>
  );
};

export default AggregationSumAverage;
