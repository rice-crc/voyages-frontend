import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateAQueryLinkRequest } from '@/share/InterfaceTypes';

export const fetchQueryLinkSaveSearch = createAsyncThunk(
    'voyage/fetchQueryLinkSaveSearch',
    async (dataSend?: CreateAQueryLinkRequest) => {
        try {
            const response = await axios.post(
                `${BASEURL}/assessment/permalink/`,
                dataSend,
                {
                    headers: {
                        'Authorization': AUTHTOKEN,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response;
        } catch (error) {
            throw new Error('Failed to fetchQueryLinkSaveSearch data');
        }
    }
);
