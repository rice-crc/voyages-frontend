import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGeoTreeSelectLists = createAsyncThunk(
    'geoTreeSelect/fetchGeoTreeSelectLists',
    async (keyOptions: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/geo/`,
                keyOptions,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchGeoTreeSelectLists data');
        }
    }
);