import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { IRootFilterObjectScatterRequest } from '@/share/InterfaceTypes';

export const fetchVoyageGraphGroupby = async (dataSend?: IRootFilterObjectScatterRequest) => {
    const response = await axios.post(`${BASEURL}/voyage/groupby/`, dataSend, {
        headers: {
            'Authorization': AUTHTOKEN,
            "Content-Type": "application/json",

        }
    });
    return response.data;
};
