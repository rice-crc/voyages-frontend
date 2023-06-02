import React, {
  useEffect,
  useState,
  FunctionComponent,
  ChangeEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setValue,
  setKeyValue,
  setIsChange,
  setRangeSliderValue,
} from "@/redux/rangeSliderSlice";
import { Grid } from "@mui/material";
import { CustomSlider, Input } from "@/styleMUI";
import { AppDispatch, RootState } from "@/redux/store";
import {
  AutoCompleteInitialState,
  RangeSliderState,
} from "@/share/InterfaceTypes";
import { fetchRangeSliderData } from "@/fetchAPI/fetchAggregationsSlider";

interface GetSliderProps {}

const RangeSlider: FunctionComponent<GetSliderProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    value,
    varName,
    rangeSliderMinMax: rangeValue,
  } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState);
  const { autoCompleteValue } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const [rangeMinMax, setRangeMinMax] = useState<number[]>([0, 0]);

  const min = value?.[varName]?.[0] || 0;
  const max = value?.[varName]?.[1] || 0;

  useEffect(() => {
    const formData: FormData = new FormData();
    formData.append("aggregate_fields", varName);
    dispatch(fetchRangeSliderData(formData))
      .unwrap()
      .then((response: any) => {
        if (response) {
          const initialValue: number[] = [
            response[varName].min,
            response[varName].max,
          ];
          if (rangeValue[varName]) {
            setRangeMinMax(rangeValue[varName]);
          } else {
            setRangeMinMax(initialValue);
          }
          dispatch(
            setRangeSliderValue({
              ...rangeValue,
              [varName]: initialValue as number[],
            })
          );
          dispatch(setKeyValue(varName));
          dispatch(
            setValue({
              ...value,
              [varName]: initialValue,
            })
          );
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, [dispatch, varName]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    dispatch(setIsChange(true));
    setRangeMinMax(newValue as number[]);
    dispatch(
      setRangeSliderValue({
        ...rangeValue,
        [varName]: newValue as number[],
      })
    );
    const filterObject = {
      rangeValue: { ...rangeValue, [varName]: newValue },
      autoCompleteValue,
    };
    const filterObjectString = JSON.stringify(filterObject);
    localStorage.setItem("filterObject", filterObjectString);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedSliderValue = [...rangeMinMax];
    updatedSliderValue[name === "start" ? 0 : 1] = Number(value);
    setRangeMinMax(updatedSliderValue);
    dispatch(
      setRangeSliderValue({
        ...rangeValue,
        [varName]: updatedSliderValue,
      })
    );
    const filterObject = {
      rangeValue: { ...rangeValue, [varName]: updatedSliderValue },
      autoCompleteValue,
    };
    const filterObjectString = JSON.stringify(filterObject);
    localStorage.setItem("filterObject", filterObjectString);
  };

  return (
    <Grid sx={{ width: 350 }}>
      <Input
        color="secondary"
        name="start"
        style={{ fontSize: 22, fontWeight: 500 }}
        value={rangeMinMax[0]}
        size="small"
        onChange={handleInputChange}
        inputProps={{
          step: max - min > 20 ? 10 : 1,
          min: min,
          max: max,
          type: "number",
          "aria-labelledby": "input-slider",
          position: "left",
        }}
      />
      <Input
        name="end"
        value={rangeMinMax[1]}
        size="small"
        onChange={handleInputChange}
        style={{ fontSize: 22, fontWeight: 500 }}
        inputProps={{
          step: max - min > 20 ? 10 : 1,
          min: min,
          max: max,
          type: "number",
          "aria-labelledby": "input-slider",
          position: "left",
        }}
      />
      <CustomSlider
        size="small"
        min={min}
        max={max}
        getAriaLabel={() => "Temperature range"}
        value={rangeMinMax}
        onChange={handleSliderChange}
      />
    </Grid>
  );
};

export default RangeSlider;
