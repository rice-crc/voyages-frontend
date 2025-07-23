import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { MapPropsRequest } from '@/share/InterfaceTypes';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchEnslavedMap = createAsyncThunk(
  'enslavedMap/fetchEnslavedMap',
  async (dataSend?: MapPropsRequest) => {
    try {
      const response = await axios.post(
        `${BASEURL}/past/enslaved/aggroutes/`,
        dataSend,
        {
          headers: {
            Authorization: AUTHTOKEN,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch {
      throw new Error('Failed to fetch fetchEnslavedMap data');
    }
  },
);
