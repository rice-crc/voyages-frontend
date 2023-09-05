import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEnslavedMap = createAsyncThunk(
    'enslavedMap/fetchEnslavedMap',
    async (formData?: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaved/aggroutes`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchEnslavedMap data');
        }
    }
);
