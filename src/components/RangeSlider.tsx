import React, { useEffect, useState, FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRange, setValue } from '../redux/rangeSliderSlice'
import { Divider, Grid } from "@mui/material";
import { CustomSlider, Input } from '../styleMUI';
import { AppDispatch, RootState } from '../redux/store';
import { RangeSliderState } from '../share/InterfaceTypes';
import { fetchRangeSliderData } from '../fetchAPI/fetchAggregationsSlider';


interface GetSliderProps {
    label?: string;
    setRangeValue: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
    rangeValue?: Record<string, number[]>;
    keyOption: string 
}
const RangeSlider: FunctionComponent<GetSliderProps> = (props) => {
    const { setRangeValue, rangeValue, label, keyOption } = props;
    const { value } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState)
    const [silderValue, setSilderValue] = useState<number[]>([0,0])
    const dispatch: AppDispatch = useDispatch();
    const min = value?.[keyOption]?.[0] || 0
    const max = value?.[keyOption]?.[1] || 0
    useEffect(() => {
        const formData: FormData = new FormData();
        formData.append('aggregate_fields', keyOption);
        dispatch(fetchRangeSliderData(formData))
            .unwrap()
            .then((response: any) => {
                if (response) {
                    const initialValue : number[] = [response[keyOption].min, response[keyOption].max];
                    dispatch(setRange(initialValue))
                    dispatch(setValue({
                        ...value, [keyOption]: initialValue
                    }))
                    setSilderValue(initialValue)
                    setRangeValue({
                        ...rangeValue, [keyOption]: initialValue  as number[]
                    })
                }
            })
            .catch((error: any) => {
                console.log('error', error)
            });
    }, [dispatch,keyOption]);
    
    const handleSliderChange = (event: Event, newValue:number| number[]) => {
        setSilderValue(newValue as number[])
        dispatch(setRange(newValue as number[]));
        setRangeValue({
            ...rangeValue, [keyOption]: newValue  as number[]
        })
    };
    
    return (
        <Grid  sx={{ width: 350 }}>
                    <Input
                        color="secondary"
                        name="start"
                        value={silderValue[0]}
                        size="small"
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
                        value={silderValue[1]}
                        size="small"
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
                    value={silderValue}
                    onChange={handleSliderChange}
                />
            </Grid>
    );
};

export default RangeSlider;
