import React, {
  useEffect,
  useState,
  FunctionComponent,
  ChangeEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRange, setValue, setKeyValue } from "@/redux/rangeSliderSlice";
import { Grid } from "@mui/material";
import { CustomSlider, Input } from "@/styleMUI";
import { AppDispatch, RootState } from "@/redux/store";
import { RangeSliderState } from "@/share/InterfaceTypes";
import { fetchRangeSliderData } from "@/fetchAPI/fetchAggregationsSlider";

interface GetSliderProps {
  label?: string;
  setRangeValue: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
  rangeValue?: Record<string, number[]>;
  keyOption: string;
}
const RangeSlider: FunctionComponent<GetSliderProps> = (props) => {
  const { setRangeValue, rangeValue, keyOption } = props;
  const { value } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const [sliderValue, setSilderValue] = useState<number[]>(() => {
    const storeSliderValue = localStorage.getItem("rangValue");
    return storeSliderValue ? JSON.parse(storeSliderValue) : [0, 0];
  });
  const dispatch: AppDispatch = useDispatch();
  const min = value?.[keyOption]?.[0] || 0;
  const max = value?.[keyOption]?.[1] || 0;
  useEffect(() => {
    const formData: FormData = new FormData();
    formData.append("aggregate_fields", keyOption);
    dispatch(fetchRangeSliderData(formData))
      .unwrap()
      .then((response: any) => {
        if (response) {
          const initialValue: number[] = [
            response[keyOption].min,
            response[keyOption].max,
          ];
          dispatch(setRange(initialValue));
          dispatch(setKeyValue(keyOption));
          dispatch(
            setValue({
              ...value,
              [keyOption]: initialValue,
            })
          );
          setSilderValue(initialValue);
          setRangeValue({
            ...rangeValue,
            [keyOption]: initialValue as number[],
          });
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, [dispatch, keyOption]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSilderValue(newValue as number[]);
    dispatch(setRange(newValue as number[]));
    setRangeValue({
      ...rangeValue,
      [keyOption]: newValue as number[],
    });
  };

  useEffect(() => {
    localStorage.setItem("rangValue", JSON.stringify(sliderValue));
  }, [sliderValue]);

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedSliderValue = [...sliderValue];
    updatedSliderValue[name === "start" ? 0 : 1] = Number(value);
    console.log("updatedSliderValue", updatedSliderValue);
    setSilderValue(updatedSliderValue);
    setRangeValue({
      ...rangeValue,
      [keyOption]: updatedSliderValue,
    });
  };

  return (
    <Grid sx={{ width: 350 }}>
      <Input
        color="secondary"
        name="start"
        style={{ fontSize: 22, fontWeight: 500 }}
        value={sliderValue[0]}
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
        value={sliderValue[1]}
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
        value={sliderValue}
        onChange={handleSliderChange}
      />
    </Grid>
  );
};

export default RangeSlider;
