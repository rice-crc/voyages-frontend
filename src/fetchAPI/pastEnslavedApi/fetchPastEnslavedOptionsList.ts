import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEnslavedOptionsList = createAsyncThunk(
    'enslavedOptions/fetchEnslavedOptionsList',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaved/`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response;
        } catch (error) {
            throw new Error('Failed to fetchEnslavedOptionsList data');
        }
    }
);
