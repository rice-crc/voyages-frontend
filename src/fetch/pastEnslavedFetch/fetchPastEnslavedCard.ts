import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchPastEnslavedCard = createAsyncThunk(
  'enslavedOptions/fetchEnslavedOptionsList',
  async (id?: number) => {
    try {
      const response = await axios.get(`${BASEURL}/past/enslaved/${id}`, {
        headers: {
          Authorization: AUTHTOKEN,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch {
      throw new Error('Failed to fetchEnslavedOptionsList data');
    }
  },
);
