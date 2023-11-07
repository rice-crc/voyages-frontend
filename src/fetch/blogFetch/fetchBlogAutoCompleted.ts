import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBlogAutoCompleted = createAsyncThunk(
    'BlogData/fetchBlogAutoCompleted',
    async (dataSend?: { [key: string]: string[] }) => {

        try {
            const response = await axios.post(
                `${BASEURL}/blog/autocomplete/`,
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
            throw new Error('Failed to fetch fetchBlogAutoCompleted data');
        }
    }
);
