import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchVoyageSortedEnslavedTableData = createAsyncThunk(
    'enslavedOptions/fetchVoyageSortedEnslavedTableData',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}past/enslaved/`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetchVoyageSortedEnslavedTableData data');
        }
    }
);
