import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPastEnslaversRangeSliderData = createAsyncThunk(
    'rangeSlider/fetchPastEnslaversRangeSliderData',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaver/aggregations`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetchPastEnslaversRangeSliderData data');
        }
    }
);
