import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPivotCrosstabsTables = createAsyncThunk(
    'voyage/fetchPivotCrosstabsTables',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/crosstabs`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response;
        } catch (error) {
            throw new Error('Failed to fetchPivotCrosstabsTables data');
        }
    }
);
