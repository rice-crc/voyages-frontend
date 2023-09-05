import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchApiPivotCrosstabsTables = createAsyncThunk(
    'voyage/fetchApiPivotCrosstabsTables',
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
            throw new Error('Failed to fetchApiPivotCrosstabsTables data');
        }
    }
);
