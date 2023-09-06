import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEnslaversGeoTreeSelect = createAsyncThunk(
    'geoTreeSelect/fetchEnslaversGeoTreeSelect',
    async (keyOptions: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaver/geotree`,
                keyOptions,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchEnslaversGeoTreeSelect data');
        }
    }
);