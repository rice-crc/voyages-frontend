

import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPastNetworksGraphApi = createAsyncThunk(
    'pastNetworks/fetchPastNetworksGraph',
    async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}past/networks`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetchPastNetworksGraph data');
        }
    }
);
