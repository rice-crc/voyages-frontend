import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRange, setValue } from '../redux/rangeSliderSlice'
import { Typography } from "@mui/material";
import { CustomSlider, Input, Item } from '../styleMUI';
import { fetchRangeSliderData } from '../fetchAPI/FetchAggregationsSlider';
import { AppDispatch, RootState } from '../redux/store';
import { RangeSliderState } from '../share/TableRangeSliderType';

interface GetSliderProps {
    label: string;
    setRangeValue: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
    idOption: number;
    rangeValue: Record<string, number[]>;
    keyOption: string
}
const RangeSlider: React.FC<GetSliderProps> = (props) => {
    const { setRangeValue, idOption, rangeValue, label, keyOption } = props;
    const dispatch: AppDispatch = useDispatch();
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
                        ...value, [idOption]: initialValue
                    }))
                }
            })
            .catch((error: any) => {
                console.log('error', error)
            });
    }, [dispatch,idOption]);

    const { value, range } = useSelector((state: RootState) =>  state.rangeSlider as RangeSliderState)
    const min = value?.[idOption]?.[0]
    const max = value?.[idOption]?.[1]
    
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        dispatch(setRange(newValue as number[]));
        setRangeValue({
            ...rangeValue, [idOption]: newValue
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
                    value={[min,max] || []}
                    onChange={handleSliderChange}
                />
            </Item>
        </div>
    );
};

export default RangeSlider;
