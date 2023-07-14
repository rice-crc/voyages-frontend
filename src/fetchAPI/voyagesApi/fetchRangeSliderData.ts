import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRangeSliderData = createAsyncThunk(
    'rangeSlider/fetchRangeData',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}voyage/aggregations`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch range slider data');
        }
    }
);
