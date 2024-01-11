
import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { TableListPropsRequest } from '@/share/InterfaceTypes';

export const fetchVoyageOptionsAPI = async (dataSend?: TableListPropsRequest) => {
    const response = await axios.post(`${BASEURL}/voyage/`, dataSend, {
        headers: {
            'Authorization': AUTHTOKEN,
            "Content-Type": "application/json",

        }
    });
    return response.data;
};

