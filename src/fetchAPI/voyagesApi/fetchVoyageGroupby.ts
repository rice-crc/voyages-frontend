import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchVoyageGraphGroupby = createAsyncThunk(
    'VoyageGroupby/fetchVoyageGraphGroupby',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/groupby`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchVoyageGraphGroupby data');
        }
    }
);
