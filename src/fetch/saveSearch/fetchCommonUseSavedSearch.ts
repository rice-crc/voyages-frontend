import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCommonUseSavedSearch = createAsyncThunk(
  'commonUseSavedSearch/fetchCommonUseSavedSearch',
  async (id: string) => {
    try {
      const response = await axios.get(
        `${BASEURL}/common/usesavedsearch/${id}`,
        {
          headers: {
            Authorization: AUTHTOKEN,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch fetchCommonUseSavedSearch data');
    }
  }
);
