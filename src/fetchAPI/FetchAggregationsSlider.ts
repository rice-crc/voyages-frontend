
// export const requestAggregations = async()=>{
//     const res = await fetch(`https://voyages3-api.crc.rice.edu/voyage/aggregations`,{
//         method: "POST",
//         headers: {'Authorization': 'Token ba4a9c10dd8685860fd97f47f505e39bc135528a'}
//     })
//     return res.json()
// }

const AUTHTOKEN = `Token ba4a9c10dd8685860fd97f47f505e39bc135528a`
const BASEURL = `https://voyages3-api.crc.rice.edu/`




import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React from 'react';
import { RangeSliderProps } from '../components/Slider';
export const fetchRangeSlider = async (
    keyOption: string,
    setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
    setValue: React.Dispatch<React.SetStateAction<[number, number]>>,
    setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
    const data = new FormData();
    data.append('aggregate_fields', keyOption);

    const AUTHTOKEN = `Token ba4a9c10dd8685860fd97f47f505e39bc135528a`
    const BASEURL = `https://voyages3-api.crc.rice.edu/`

    const config: AxiosRequestConfig = {
        method: 'post',
        baseURL: `${BASEURL}voyage/aggregations`,
        headers: { 'Authorization': AUTHTOKEN },
        data: data
    }
    try {
        const res: AxiosResponse<any> = await axios(config);
        const responseData: RangeSliderProps = res.data;
        if (Object.values(responseData)[0]["min"] || Object.values(responseData)[0]["max"]) {
            setRange([
                Object.values(responseData)[0]["min"],
                Object.values(responseData)[0]["max"],
            ]);
            setValue([
                Object.values(responseData)[0]["min"],
                Object.values(responseData)[0]["max"],
            ]);
        } else if (Object.values(responseData)[0]["min"] === null || Object.values(responseData)[0]["max"] === null) {
            setMessage('Min and Max have not value');
        }
    } catch (error) {
        console.error(error);
    }
}