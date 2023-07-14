import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPastEnslavedRangeSliderData = createAsyncThunk(
    'rangeSlider/fetchPastEnslavedRangeSliderData',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}past/enslaved/aggregations`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetchPastEnslavedRangeSliderData data');
        }
    }
);
