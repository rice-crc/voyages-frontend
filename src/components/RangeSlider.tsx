import React, { useEffect, useState, FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRange, setValue } from '../redux/rangeSliderSlice'
import { Typography } from "@mui/material";
import { CustomSlider, Input, Item } from '../styleMUI';
import { AppDispatch, RootState } from '../redux/store';
import { RangeSliderState } from '../share/InterfaceTypes';
import { fetchRangeSliderData } from '../fetchAPI/FetchAggregationsSlider';

interface GetSliderProps {
    label: string;
    setRangeValue: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
    rangeValue: Record<string, number[]>;
    keyOption: string
}
const RangeSlider: FunctionComponent<GetSliderProps> = (props) => {
    const { setRangeValue, rangeValue, label, keyOption } = props;
    const [silderValue, setSilderValue] = useState<number[]>([0,0])
    const dispatch: AppDispatch = useDispatch();

    const { value } = useSelector((state: RootState) =>  state.rangeSlider as RangeSliderState)
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
        <div>
            <Item>
                <Typography>{label}</Typography>
                <div className="sliderInputs">
                    <Input
                        color="secondary"
                        name="start"
                        value={min}
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
                        value={max}
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
                </div>
                <CustomSlider
                    size="small"
                    min={min}
                    max={max}
                    getAriaLabel={() => "Temperature range"}
                    value={silderValue}
                    onChange={handleSliderChange}
                />
            </Item>
        </div>
    );
};

export default RangeSlider;
