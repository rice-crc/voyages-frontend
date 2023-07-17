import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPastEnslaversSortedTableData = createAsyncThunk(
    'enslaversOptions/fetchPastEnslaversSortedTableData',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}past/enslaver/`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetchPastEnslaversSortedTableData data');
        }
    }
);
