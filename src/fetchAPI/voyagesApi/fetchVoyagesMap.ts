import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchVoyagesMap = createAsyncThunk(
    'voyagesMap/fetchVoyagesMap',
    async (formData?: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}voyage/aggroutes`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchVoyagesMap data');
        }
    }
);
