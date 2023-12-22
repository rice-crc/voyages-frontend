import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAutoVoyageParams } from '@/share/InterfaceTypes';

export const fetchAutoVoyageComplete = createAsyncThunk(
    'autoComplete/fetchAutoVoyageComplete',
    async (dataSend?: { [key: string]: string[] }) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/autocomplete/`,
                dataSend,
                {
                    headers: {
                        'Authorization': AUTHTOKEN,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch fetchAutoVoyageComplete data');
        }
    }
);




// ===============  WAIT TO CHANGE NEW FORMAT ===============

// export const fetchAutoVoyageComplete = createAsyncThunk(
//     'autoComplete/fetchAutoVoyageComplete',
//     async (params: FetchAutoVoyageParams) => {
//         const { varName, autoValue, offset, limit } = params;

//         const url = `${BASEURL}/voyage/autocomplete/?varname=${varName}&query=${autoValue || ''}&offset=${offset}&limit=${limit}`;
//         try {
//             const response = await axios.get(url, {
//                 headers: {
//                     'Authorization': AUTHTOKEN,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             return response.data;
//         } catch (error) {
//             throw new Error('Failed to fetch fetchAutoVoyageComplete data');
//         }
//     })
