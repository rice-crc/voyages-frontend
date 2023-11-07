import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchVoyagesMap = createAsyncThunk(
    'voyagesMap/fetchVoyagesMap',
    async (dataSend?: { [key: string]: (string | number)[] }) => {

        try {
            const response = await axios.post(
                `${BASEURL}/voyage/aggroutes/`,
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
            throw new Error('Failed to fetch fetchVoyagesMap data');
        }
    }
);
