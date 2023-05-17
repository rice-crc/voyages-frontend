/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Stack, Box,Typography } from "@mui/material";
import { IsShowProp } from "../share/TableRangeSliderType";
import { fetchRangeSlider } from "../fetchAPI/FetchAggregationsSlider";
import { Item,Input,CustomSlider } from "../styleMUI";

export interface RangeSliderProps {
  keyOption: MinMaxProps
}

export interface MinMaxProps {
  min: number
  max: number
}


interface GetSliderProps {
  label: string;
  keyOption: string;
  setRangeValue: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
  idOption: number;
  rangeValue: Record<string, number[]>;
  setMessage: React.Dispatch<React.SetStateAction<string>>
  isShow: IsShowProp
}
const GetSlider: React.FC<GetSliderProps> = (props) => {
  const { label, keyOption, setRangeValue, idOption, rangeValue, setMessage } = props;

  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [value, setValue] = useState<[number, number]>([Number(range[0]) / 2, Number(range[1]) / 2]);

  useEffect(() => {
    fetchRangeSlider(keyOption, setRange, setValue, setMessage);
  }, []);


  const handleCommittedChange = (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) => {
    setValue(newValue as [number, number]);
  };
 
  const handleChange = (event:Event, newValue:number | number[]) => {
    setValue(newValue as [number, number]);
    setRangeValue({
      ...rangeValue, [idOption]: newValue
    })
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const startVal = value[0];
    const endVal = value[1];
    let res: [number, number] = [0, 0];
  
    if (event.target.name === "end") {
      res = [startVal, Number(event.target.value)];
    } else if (event.target.name === "start") {
      res = [Number(event.target.value), endVal];
    }
  
    setValue(res as [number, number]);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const curStart = value[0];
    const curEnd = value[1];
    if (event.target.name === "end") {
      const endValue = Number(event.target.value);
      if (endValue > Number(range[1])) {
        setValue([curStart, Number(range[1])]);
      } else if (endValue < curStart) {
        setValue([
          curStart,
          curStart + 1 < Number(range[1]) ? curStart + 1 : Number(range[1]),
        ]);
      }
    } else if (event.target.name === "start") {
      const startValue = Number(event.target.value);
      if (startValue > curEnd) {
        setValue([
          curEnd - 1 < Number(range[0]) ? Number(range[0]) : curEnd - 1,
          curEnd,
        ]);
      } else if (startValue < Number(range[0])) {
        setValue([Number(range[0]), curEnd]);
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Item> <Typography>{label}</Typography>
          <div className="sliderInputs">
            <Input
              color="secondary"
              name="start"
              value={value[0]}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                  const inputValue = Number(event.currentTarget.value);
                  if (inputValue < Number(range[0])) {
                    setValue([Number(range[0]), value[1]]);
                  } else if (inputValue > Number(range[1])) {
                    setValue([
                      value[1] - 1 < Number(range[0]) ? Number(range[0]) : value[1] - 1,
                      value[1],
                    ]);
                  }
                }
              }}
              inputProps={{
                step: Number(range[1]) - Number(range[0]) > 20 ? 10 : 1,
                min: Number(range[0]),
                max: Number(range[1]),
                type: "number",
                "aria-labelledby": "input-slider",
                position: "left",
              }}
            />
            <Input
              name="end"
              value={value[1]}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                  const inputValue = Number(event.currentTarget.value);
                  if (inputValue > Number(range[1])) {
                    setValue([value[0], Number(range[1])]);
                  } else if (inputValue < value[0]) {
                    setValue([
                      value[0],
                      value[0] + 1 < Number(range[1]) ? value[0] + 1 : (range[1]),
                    ]);
                  }
                }
              }}
              inputProps={{
                step: Number(range[1]) - Number(range[0]) > 20 ? 10 : 1,
                min: Number(range[0]),
                max: Number(range[1]),
                type: "number",
                "aria-labelledby": "input-slider",
                position: "left",
              }}
            />
          </div>
          <CustomSlider
            size="small"
            min={Number(Number(range[0]))}
            max={Number(Number(range[1]))}
            getAriaLabel={() => "Temperature range"}
            value={value}
            onChange={handleChange}
            onChangeCommitted={handleCommittedChange}
          />
        </Item>
      </Stack>
    </Box>

  );
}
export default GetSlider