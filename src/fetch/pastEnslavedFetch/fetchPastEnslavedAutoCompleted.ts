import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { FetchAutoVoyageParams } from '@/share/InterfaceTypes';
import { IRootObject } from '@/share/InterfaceTypesTable';

export const fetchPastEnslavedAutoComplete = createAsyncThunk(
    'autoComplete/fetchPastEnslavedAutoComplete',
    async (dataSend?: IRootObject) => {
        try {
            const response = await axios.post(
                `${BASEURL}/past/enslaved/autocomplete/`,
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
            throw new Error('Failed to fetch PastEnslavedAutoComplete data');
        }
    }
);


// ===============  WAIT TO CHANGE NEW FORMAT ===============
// export const fetchPastEnslavedAutoComplete = createAsyncThunk(
//     'autoComplete/fetchPastEnslavedAutoComplete',
//     async (params: FetchAutoVoyageParams) => {
//         const { varName, autoValue, offset, limit } = params;

//         const url = `${BASEURL}/past/enslaved/autocomplete/?varname=${varName}&query=${autoValue || ''}&offset=${offset}&limit=${limit}`;
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
