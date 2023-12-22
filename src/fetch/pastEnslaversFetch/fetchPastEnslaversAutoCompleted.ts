import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAutoVoyageParams } from '@/share/InterfaceTypes';


export const fetchPastEnslaversAutoCompleted = createAsyncThunk(
    'autoComplete/fetchPastEnslaversAutoCompleted',
    async (dataSend?: { [key: string]: string[] }) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaver/autocomplete/`,
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
            throw new Error('Failed to fetch fetchPastEnslaversAutoCompleted data');
        }
    }
);


// ===============  WAIT TO CHANGE NEW FORMAT ===============

// export const fetchPastEnslaversAutoCompleted = createAsyncThunk(
//     'autoComplete/fetchPastEnslaversAutoCompleted',
//     async (params: FetchAutoVoyageParams) => {
//         const { varName, autoValue, offset, limit } = params;

//         const url = `${BASEURL}/past/enslaver/autocomplete/?varname=${varName}&query=${autoValue || ''}&offset=${offset}&limit=${limit}`;
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
