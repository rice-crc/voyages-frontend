import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAuthorData = createAsyncThunk(
    'BlogData/fetchAuthorData',
    async (formData?: FormData) => {
        try {
            const response = await axios.post(
                `${BASEURL}/blog/author`,
                formData,
                {
                    headers: { 'Authorization': AUTHTOKEN },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchAuthorData data');
        }
    }
);
