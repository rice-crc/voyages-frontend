import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetcVoyagesGeoTreeSelectLists = createAsyncThunk(
    'geoTreeSelect/fetcVoyagesGeoTreeSelectLists',
    async (keyOptions: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/geotree`,
                keyOptions,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetcVoyagesGeoTreeSelectLists data');
        }
    }
);