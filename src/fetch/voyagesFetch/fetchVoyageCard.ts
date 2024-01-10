
import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchVoyageCard = createAsyncThunk(
    'voyageOptions/fetchVoyageOptionsAPI',
    async (id?: number) => {
        try {
            const response = await axios.get(
                `${BASEURL}/voyage/${id}`,
                {
                    headers: {
                        'Authorization': AUTHTOKEN,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response;
        } catch (error) {
            throw new Error('Failed to fetchVoyageOptionsAPI data');
        }
    }
);