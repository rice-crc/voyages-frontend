import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchPastNetworksGraphApi = createAsyncThunk(
  'pastNetworks/fetchPastNetworksGraph',
  async (dataSend?: { [key: string]: number[] }) => {
    try {
      const response = await axios.post(`${BASEURL}/past/networks/`, dataSend, {
        headers: {
          Authorization: AUTHTOKEN,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch {
      throw new Error('Failed to fetchPastNetworksGraph data');
    }
  },
);
