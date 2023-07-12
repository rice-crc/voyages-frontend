import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchVoyagesOptionsApi = async () => {
    try {
        const response = await axios.options(
            `${BASEURL}voyage/?hierarchical=False`,
            {
                headers: { 'Authorization': AUTHTOKEN },
            }
        );
        return response;
    } catch (error) {
        throw new Error('Failed to fetchVoyagesOptionsApi data');
    }
}
