
import { TableListPropsRequest } from '@/share/InterfaceTypes';
import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const fetchVoyageOptionsAPI = createAsyncThunk(
    'voyageOptions/fetchVoyageOptionsAPI',
    async (dataSend?: TableListPropsRequest) => {
        try {
            const response = await axios.post(
                `${BASEURL}/voyage/`,
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
            throw new Error('Failed to fetchVoyageOptionsAPI data');
        }
    }
);

// export const fetchVoyageOptionsAPI = async (dataSend?: TableListPropsRequest) => {
//     const response = await axios.post(`${BASEURL}/voyage/`, dataSend, {
//         headers: {
//             'Authorization': AUTHTOKEN,
//             "Content-Type": "application/json",

//         }
//     });
//     return response.data;
// };




