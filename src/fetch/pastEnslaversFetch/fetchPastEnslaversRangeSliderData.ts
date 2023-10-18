import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPastEnslaversRangeSliderData = createAsyncThunk(
    'rangeSlider/fetchPastEnslaversRangeSliderData',
    async (dataSend?: { [key: string]: string[] }) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaver/aggregations`,
                dataSend,
                {
                    headers: {
                        'Authorization': AUTHTOKEN,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetchPastEnslaversRangeSliderData data');
        }
    }
);
