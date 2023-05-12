/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {  Stack, Box, Paper,Slider,Typography} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiInput from "@mui/material/Input";
import axios from 'axios';
const Input = styled(MuiInput)`
  width: 80px;
`;
const blue500 = "#42a5f5";

const CustomSlider = styled(Slider)(() => ({
  color: blue500, 
  width: "70%",
  height: "5px",
  "& .MuiSlider-thumb": {
    backgroundColor: blue500,
   
  },
  "& .MuiSlider-rail": {
    color: blue500 ,
    
  }
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function GetSlider(props) {
  const { label, keyOption,setRangeValue, idOption,rangeValue,setMessage}  = props //range, setRange ,value,setValue

  const [range, setRange] = useState([0, 0]);
  const [value, setValue] = useState([Number(range[0]) / 2, Number(range[1]) / 2]);

  const data = new FormData();
  data.append('aggregate_fields', keyOption);

  const AUTHTOKEN = `Token ba4a9c10dd8685860fd97f47f505e39bc135528a`
  const BASEURL   = `https://voyages3-api.crc.rice.edu/`
  
  const config = {
    method: 'post',
    baseURL: `${BASEURL}voyage/aggregations`,
    headers: { 'Authorization': AUTHTOKEN },
    data: data
  }
  async function fetchData() {
    try {
      const res = await axios(config);
      if(Object.values(res.data)[0]["min"] || Object.values(res.data)[0]["max"] ){
        setRange([
          Object.values(res.data)[0]["min"],
          Object.values(res.data)[0]["max"],
        ]);
        setValue([
          Object.values(res.data)[0]["min"],
          Object.values(res.data)[0]["max"],
        ]);
      }else if(Object.values(res.data)[0]["min"] === null || Object.values(res.data)[0]["max"] === null ){
        setMessage('Min and Max have not value')
      }else{
       setMessage(res.message)
      }
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    fetchData()
  }, []);

  function handleCommittedChange(event, newValue) {
    setValue(newValue);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setRangeValue({
      ...rangeValue, [idOption]: newValue
    })
  };

  const handleInputChange = (event) => {
    const startVal = value[0];
    const endVal = value[1];
    var res = [0, 0];
    if (event.target.name === "end") {
      res = [startVal, Number(event.target.value)];
    } else if (event.target.name === "start") {
      res = [Number(event.target.value), endVal];
    }

    setValue(res);
  };

  const handleBlur = (event) => {
    const curStart = value[0];
    const curEnd = value[1];

    if (event.target.name === "end") {
      if (event.target.value > Number(range[1])) setValue([curStart, Number(range[1])]);
      if (event.target.value < curStart)
        setValue([curStart, curStart + 1 < Number(range[1]) ? curStart + 1 : Number(range[1])]);
    } else if (event.target.name === "start") {
      if (event.target.value > curEnd)
        setValue([curEnd - 1 < Number(range[0]) ? Number(range[0]) : curEnd - 1, curEnd]);
      if (event.target.value < Number(range[0])) setValue([Number(range[0]), curEnd]);
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
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                if (event.target.value < Number(range[0])) {
                  setValue([Number(range[0]), value[1]]);
                } else if (event.target.value > Number(range[1])) {
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
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                if (event.target.value > Number(range[1])) {
                  setValue([value[0], Number(range[1])]);
                } else if (event.target.value < value[0]) {
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
