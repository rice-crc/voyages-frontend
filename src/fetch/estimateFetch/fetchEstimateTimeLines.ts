import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TimeLineGraphRequest } from '@/share/InterfaceTypes';

export const fetchEstimateTimeLines = createAsyncThunk(
  'voyage/fetchEstimateTimeLines',
  async (dataSend?: TimeLineGraphRequest) => {
    try {
      const response = await axios.post(
        `${BASEURL}/assessment/timelines/`,
        dataSend,
        {
          headers: {
            Authorization: AUTHTOKEN,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error('Failed to fetchEstimateTimeLines data');
    }
  }
);
