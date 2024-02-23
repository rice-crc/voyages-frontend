import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { SummaryStatisticsTableRequest } from '@/share/InterfaceTypes';

export const fetchSummaryStatisticsTable = createAsyncThunk(
    'voyage/fetchSummaryStatisticsTable',
    async (dataSend?: SummaryStatisticsTableRequest) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/SummaryStats/`,
                dataSend,
                {
                    headers: {
                        'Authorization': AUTHTOKEN,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response;
        } catch (error) {
            throw new Error('Failed to fetchSummaryStatisticsTable data');
        }
    }
);
