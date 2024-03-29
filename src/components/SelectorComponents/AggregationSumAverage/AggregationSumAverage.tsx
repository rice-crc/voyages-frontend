import {
  Alert,
  AlertTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { ChangeEvent, FunctionComponent } from 'react';

interface AggregationSumAverageProps {
  aggregation: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
}
export const AggregationSumAverage: FunctionComponent<
  AggregationSumAverageProps
> = (props) => {
  const { aggregation, handleChange } = props;

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group" style={{ color: '#fff' }}>
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
          control={<Radio style={{ color: '#fff' }} />}
          label={<Typography variant="body1" style={{ color: '#fff' }}>Sum</Typography>}
        />
        <FormControlLabel
          value="mean"
          control={<Radio style={{ color: '#fff' }} />}
          label={<Typography variant="body1" style={{ color: '#fff' }}>Average</Typography>}
        />
      </RadioGroup>
    </FormControl>
  );
};
