import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEnslavedGeoTreeSelect = createAsyncThunk(
    'geoTreeSelect/fetchEnslavedGeoTreeSelect',
    async (keyOptions: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaved/geotree`,
                keyOptions,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchEnslavedGeoTreeSelect data');
        }
    }
);