import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { EstimateTablesPropsRequest } from '@/share/InterfaceTypes';

export const fetchEstimateCrosstabsTables = createAsyncThunk(
  'voyage/fetchEstimateCrosstabsTables',
  async (dataSend?: EstimateTablesPropsRequest) => {
    try {
      const response = await axios.post(
        `${BASEURL}/assessment/crosstabs/`,
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
      throw new Error('Failed to fetchEstimateCrosstabsTables data');
    }
  }
);
