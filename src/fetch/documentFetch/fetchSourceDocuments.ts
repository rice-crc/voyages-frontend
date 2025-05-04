import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSourceDocuments = createAsyncThunk(
  'DocumentData/fetchSourceDocuments',
  async (dataSend?: any) => {
    try {
      const response = await axios.post(`${BASEURL}/blog/author/`, dataSend, {
        headers: {
          Authorization: AUTHTOKEN,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch fetchSourceDocuments data');
    }
  }
);
