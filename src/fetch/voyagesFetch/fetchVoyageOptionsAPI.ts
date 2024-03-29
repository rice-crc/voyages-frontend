
import { TableListPropsRequest } from '@/share/InterfaceTypes';
import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchVoyageOptionsAPI = async (dataSend?: TableListPropsRequest) => {
    const response = await axios.post(`${BASEURL}/voyage/`, dataSend, {
        headers: {
            'Authorization': AUTHTOKEN,
            "Content-Type": "application/json"
        }
    });
    return response.data;
};