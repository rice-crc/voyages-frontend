import {useContext, useState,useEffect} from "react";
import { styled } from "@mui/material/styles";
import MuiInput from "@mui/material/Input";
import axios from 'axios';
import { Slider } from "@mui/material";
import VoyageContext from '../context/VoyageContext'
const Input = styled(MuiInput)`
  width: 80px;
`;



export default function GetSlider() {
   
    const {setIsShowSlider,isShowSlider, optionsFlatlabel,labelId} = useContext(VoyageContext)

  
// console.log('aggregations-->', aggregations)
//   const { labels, setLabels } = useContext(AppContext);
//   const {search_object, set_search_object, typeForTable, setPage} = useContext(props)
//   const curLabel = labels[index];

//   const varName = curLabel["option"];
//   const varDisplay = modifyName(curLabel["label"]);
optionsFlatlabel.forEach((element) => {

    if(element.id === labelId ){
        setIsShowSlider(true)
    }
    
});

  const [range, setRange] = useState([0, 0]);
  const [value, setValue] = useState([range[0] / 2, range[1] / 2]);


//   const data = new FormData();
//   data.append("aggregate_fields", varName);
  const endpoint =(()=> {
    // switch (typeForTable) {
    //   case "slaves":
    //     return "past/enslaved/"
    //   case "enslavers":
    //     return "past/enslavers/"
    //   default:
    //     return "voyage/"
    // }
  })()
  const BaseUrl = `https://voyages3-api.crc.rice.edu/s`

  const config =  {
      method: 'post',
      baseURL: BaseUrl+endpoint+'aggregations',
      headers: {'Authorization': `Token ba4a9c10dd8685860fd97f47f505e39bc135528a`},
    //   data: data
  }


  useEffect(() => {
    axios(config)
      .then((res) => {
        console.log('res-->', res)
        setRange([
          Object.values(res.data)[0]["min"],
          Object.values(res.data)[0]["max"],
        ]);
        setValue([
          Object.values(res.data)[0]["min"],
          Object.values(res.data)[0]["max"],
        ]);
      })
      .then(console.log(""));
    //   .then(console.log("HTTP resquest from Slider", config));
  }, []);

  function handleCommittedChange(event, newValue) {
    // setPage(0);
    // set_search_object({
    //   // <---------- UPDATE SEARCH OBJECT
    //   ...search_object,
    //   [varName]: [value[0], value[1]],
    // });
    setValue(newValue);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    const startVal = value[0];
    const endVal = value[1];
    var res = [0, 0];
    if (event.target.name === "end") {
      res = [startVal, Number(event.target.value)];
      // setValue([startVal, Number(event.target.value)])
    } else if (event.target.name === "start") {
      res = [Number(event.target.value), endVal];
      // setValue([Number(event.target.value), endVal])
    }

    setValue(res);
  };

  const handleBlur = (event) => {
    const curStart = value[0];
    const curEnd = value[1];

    if (event.target.name === "end") {
      if (event.target.value > range[1]) setValue([curStart, range[1]]);
      if (event.target.value < curStart)
        setValue([curStart, curStart + 1 < range[1] ? curStart + 1 : range[1]]);
    } else if (event.target.name === "start") {
      if (event.target.value > curEnd)
        setValue([curEnd - 1 < range[0] ? range[0] : curEnd - 1, curEnd]);
      if (event.target.value < range[0]) setValue([range[0], curEnd]);
    } else {
      //console.log("range selection legit", value)
    }
    // setPage(0);
    // set_search_object({
    //   // <---------- UPDATE SEARCH OBJECT
    //   ...search_object,
    //   [varName]: [value[0], value[1]],
    // });
  };

  return (
    <>
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
              var temp = Number(event.target.value);

              if (event.target.value < range[0]) {
                setValue([range[0], value[1]]);
                temp = range[0];
              } else if (event.target.value > range[1]) {
                setValue([
                  value[1] - 1 < range[0] ? range[0] : value[1] - 1,
                  value[1],
                ]);
                temp = value[1] - 1 < range[0] ? range[0] : value[1] - 1;
              }
            //   setPage(0);
            //   set_search_object({
            //     ...search_object,
            //     [varName]: [temp, value[1]],
            //   });
            }
          }}
          inputProps={{
            step: range[1] - range[0] > 20 ? 10 : 1,
            min: range[0],
            max: range[1],
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
              var temp = Number(event.target.value);

              if (event.target.value > range[1]) {
                temp = range[1];
                setValue([value[0], range[1]]);
              } else if (event.target.value < value[0]) {
                temp = value[0] + 1 < range[1] ? value[0] + 1 : range[1];
                setValue([
                  value[0],
                  value[0] + 1 < range[1] ? value[0] + 1 : range[1],
                ]);
              }
            //   setPage(0);
            //   set_search_object({
            //     ...search_object,
            //     [varName]: [value[0], temp],
            //   });
            }
          }}
          inputProps={{
            step: range[1] - range[0] > 20 ? 10 : 1,
            min: range[0],
            max: range[1],
            type: "number",
            "aria-labelledby": "input-slider",
            position: "left",
          }}
        />
      </div>
      <Slider
        // aria-label={varDisplay}
        size="small"
        min={range[0]}
        max={range[1]}
        getAriaLabel={() => "Temperature range"}
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleCommittedChange}
      />
    </>
  );
}
