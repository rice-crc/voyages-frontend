import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchPastEnslavedAutoComplete = createAsyncThunk(
    'autoComplete/fetchPastEnslavedAutoComplete',
    async (dataSend?: { [key: string]: string[] }) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaved/autocomplete`,
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
            throw new Error('Failed to fetch PastEnslavedAutoComplete data');
        }
    }
);