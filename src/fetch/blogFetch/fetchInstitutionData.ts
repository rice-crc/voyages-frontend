import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { BlogDataPropsRequest } from '@/share/InterfaceTypesBlog';

export const fetchInstitutionData = async (dataSend?: BlogDataPropsRequest) => {
    const response = await axios.post(`${BASEURL}/blog/institution/`, dataSend, {
        headers: {
            'Authorization': AUTHTOKEN,
            "Content-Type": "application/json",

        }
    });
    return response.data;
};
