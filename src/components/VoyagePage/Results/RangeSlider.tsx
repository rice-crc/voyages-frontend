import { useEffect, useState, FunctionComponent, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setRangeValue,
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
import { fetchRangeSliderData } from "@/fetchAPI/fetchRangeSliderData";

interface GetSliderProps {}

const RangeSlider: FunctionComponent<GetSliderProps> = () => {
  const dispatch: AppDispatch = useDispatch();

  const { rangeValue, varName, rangeSliderMinMax } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { autoCompleteValue } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );

  const rangeMinMax = rangeSliderMinMax?.[varName] ||
    rangeValue?.[varName] || [0, 0];

  const min = rangeValue?.[varName]?.[0] || 0;
  const max = rangeValue?.[varName]?.[1] || 0;

  const [currentSliderValue, setCurrentSliderValue] = useState<
    number | number[]
  >(rangeMinMax);

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
          dispatch(setKeyValue(varName));
          dispatch(
            setRangeValue({
              ...rangeValue,
              [varName]: initialValue as number[],
            })
          );
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, [dispatch, varName]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setCurrentSliderValue(newValue);
  };

  const handleSliderChangeMouseUp = () => {
    dispatch(setIsChange(true));
    dispatch(
      setRangeSliderValue({
        ...rangeSliderMinMax,
        [varName]: currentSliderValue as number[],
      })
    );
    const filterObject = {
      rangeValue: { ...rangeSliderMinMax, [varName]: currentSliderValue },
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
    dispatch(
      setRangeSliderValue({
        ...rangeSliderMinMax,
        [varName]: updatedSliderValue,
      })
    );
    const filterObject = {
      rangeValue: { ...rangeSliderMinMax, [varName]: updatedSliderValue },
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
        value={rangeMinMax}
        onChange={handleSliderChange}
        onMouseUp={handleSliderChangeMouseUp}
      />
    </Grid>
  );
};

export default RangeSlider;
