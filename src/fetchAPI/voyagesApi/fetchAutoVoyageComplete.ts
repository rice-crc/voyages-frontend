import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAutoVoyageComplete = createAsyncThunk(
    'autoComplete/fetchAutoVoyageComplete',
    async (keyOptions: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/autocomplete`,
                keyOptions,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchAutoVoyageComplete data');
        }
    }
);