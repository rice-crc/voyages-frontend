import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchPastEnslavedAutoComplete = createAsyncThunk(
    'autoComplete/fetchPastEnslavedAutoComplete',
    async (keyOptions: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaved/autocomplete`,
                keyOptions,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch PastEnslavedAutoComplete data');
        }
    }
);