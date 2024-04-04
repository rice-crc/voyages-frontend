import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PivotTablesPropsRequest } from '@/share/InterfaceTypes';


export const fetchPivotCrosstabsTables = createAsyncThunk(
    'voyage/fetchPivotCrosstabsTables',
    async (dataSend?: PivotTablesPropsRequest) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/crosstabs/`,
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
            throw new Error('Failed to fetchPivotCrosstabsTables data');
        }
    }
);
