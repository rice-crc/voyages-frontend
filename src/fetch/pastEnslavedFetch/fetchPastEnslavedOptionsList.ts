import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEnslavedOptionsList = createAsyncThunk(
    'enslavedOptions/fetchEnslavedOptionsList',
    async (dataSend?: { [key: string]: (string | number)[] }) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaved/`,
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
            throw new Error('Failed to fetchEnslavedOptionsList data');
        }
    }
);
