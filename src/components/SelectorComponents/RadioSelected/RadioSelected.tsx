import { TYPES } from '@/share/InterfaceTypes';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { ChangeEvent, FunctionComponent } from 'react';

interface RadioSelectedProps {
  aggregation?: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  type?: string
}
export const RadioSelected: FunctionComponent<
  RadioSelectedProps
> = (props) => {
  const { aggregation, handleChange, type } = props;

  return (
    <FormControl>
      {type !== TYPES.EnslaverNameAndRole ?
        <span>
          <FormLabel id="demo-controlled-radio-buttons-group" style={{ color: '#000' }}>
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
              label={<Typography variant="body1" >Sum</Typography>}
            />
            <FormControlLabel
              value="mean"
              control={<Radio />}
              label={<Typography variant="body1" >Average</Typography>}
            />
          </RadioGroup>
        </span>
        : <span className='enlavers-role-radio'>
          <FormLabel id="demo-controlled-radio-buttons-group" style={{ color: '#000', paddingRight: 15 }}>
            Who had
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={aggregation}
            onChange={handleChange}
            row
          >
            <FormControlLabel
              value="any"
              control={<Radio />}
              label={<Typography variant="body1" >any</Typography>}
            />
            <FormControlLabel
              value="all"
              control={<Radio />}
              label={<Typography variant="body1" >all of these roles: </Typography>}
            />
          </RadioGroup></span>
      }
    </FormControl >
  );
};
