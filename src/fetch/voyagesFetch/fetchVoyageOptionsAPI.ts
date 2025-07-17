import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { TableListPropsRequest } from '@/share/InterfaceTypes';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchVoyageOptionsAPI = createAsyncThunk(
  'voyageOptions/fetchVoyageOptionsAPI',
  async (dataSend?: TableListPropsRequest) => {
    try {
      const response = await axios.post(`${BASEURL}/voyage/`, dataSend, {
        headers: {
          Authorization: AUTHTOKEN,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch {
      throw new Error('Failed to fetchVoyageOptionsAPI data');
    }
  },
);
