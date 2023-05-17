import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRange, setValue } from '../redux/rangeSliderSlice'
import { Typography } from "@mui/material";
import { CustomSlider, Input, Item } from '../styleMUI';
import { AppDispatch, RootState } from '../redux/store';
import { RangeSliderState } from '../share/TableRangeSliderType';
import { fetchRangeSliderData } from '../fetchAPI/FetchAggregationsSlider';

interface GetSliderProps {
    label: string;
    setValue: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
    value: Record<string, number[]>;
    keyOption: string
}
const Autocompleted: React.FC<GetSliderProps> = (props) => {
    const { setValue, value, label, keyOption } = props;
    const LABEL = label.replace(/'>/g, "").split(' : ');
   
    
    return (
        <div>
            <Item>
                <Typography>{LABEL[0]}</Typography>
            </Item>
        </div>
    );
};

export default Autocompleted;
