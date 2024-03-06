import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { SaveSearchRequest } from '@/share/InterfaceTypes';

export const fetchCommonMakeSavedSearch = createAsyncThunk(
    'commonMakeSavedSearch/fetchCommonMakeSavedSearch',
    async (dataSend?: SaveSearchRequest) => {
        try {
            const response = await axios.post(
                `${BASEURL}/common/makesavedsearch/`,
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
            throw new Error('Failed to fetch fetchCommonMakeSavedSearch data');
        }
    }
);
