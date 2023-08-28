import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBlogData = createAsyncThunk(
    'BlogData/fetchBlogData',
    async (formData?: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/blog/`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchBlogData data');
        }
    }
);
