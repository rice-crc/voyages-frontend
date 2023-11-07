import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchPastEnslaversAutoCompleted = createAsyncThunk(
    'autoComplete/fetchPastEnslaversAutoCompleted',
    async (dataSend?: { [key: string]: string[] }) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaver/autocomplete/`,
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
            throw new Error('Failed to fetch fetchPastEnslaversAutoCompleted data');
        }
    }
);