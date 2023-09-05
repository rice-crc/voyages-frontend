import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchVoyageOptionsPagination = createAsyncThunk(
    'voyageOptions/fetchVoyageOptionsPagination',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response;
        } catch (error) {
            throw new Error('Failed to fetchVoyageOptionsPagination data');
        }
    }
);
