import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchInstitutionData = createAsyncThunk(
    'BlogData/InstitutionData',
    async (formData?: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/blog/institution`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchInstitutionData data');
        }
    }
);
