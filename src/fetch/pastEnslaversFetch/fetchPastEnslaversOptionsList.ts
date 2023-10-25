import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEnslaversOptionsList = createAsyncThunk(
    'enslaversOptions/fetchEnslaversOptionsList',
    async (dataSend?: { [key: string]: (string | number)[] }) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaver/`,
                dataSend,
                {
                    headers: {
                        'Authorization': AUTHTOKEN,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response;
        } catch (error) {
            throw new Error('Failed to fetchEnslaversOptionsList data');
        }
    }
);
