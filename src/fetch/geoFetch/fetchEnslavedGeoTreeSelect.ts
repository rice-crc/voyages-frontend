import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEnslavedGeoTreeSelect = createAsyncThunk(
    'geoTreeSelect/fetchEnslavedGeoTreeSelect',
    async (dataSend?: { [key: string]: (string | number)[] }) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaved/geotree/`,
                dataSend,
                {
                    headers: {
                        'Authorization': AUTHTOKEN,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchEnslavedGeoTreeSelect data');
        }
    }
);