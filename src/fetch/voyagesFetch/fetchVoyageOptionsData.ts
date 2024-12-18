import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TableListPropsRequest } from '@/share/InterfaceTypes';

export const fetchVoyageOptionsData = createAsyncThunk(
  'voyageOptions/fetchVoyageOptionsData',
  async (dataSend?: TableListPropsRequest) => {
    try {
      const response = await axios.post(`${BASEURL}/voyage/`, dataSend, {
        headers: {
          Authorization: AUTHTOKEN,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to fetchVoyageOptionsData data');
    }
  }
);
