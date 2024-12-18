import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPastEnslaversCard = createAsyncThunk(
  'enslaversOptions/fetchEnslaversOptionsList',
  async (id?: number) => {
    try {
      const response = await axios.get(`${BASEURL}/past/enslaver/${id}`, {
        headers: {
          Authorization: AUTHTOKEN,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      throw new Error('Failed to fetchEnslaversOptionsList data');
    }
  }
);
