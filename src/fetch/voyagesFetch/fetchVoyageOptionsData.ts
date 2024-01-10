import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchVoyageOptionsData = createAsyncThunk(
    'voyageOptions/fetchVoyageOptionsData',
    async (dataSend?: any) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/`,
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
            throw new Error('Failed to fetchVoyageOptionsData data');
        }
    }
);
