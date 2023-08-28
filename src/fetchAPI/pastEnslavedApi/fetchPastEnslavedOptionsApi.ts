import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchPastEnslavedApiService = async () => {
    try {
        const response = await axios.options(
            `${BASEURL}/past/enslaved/?hierarchical=False`,
            {
                headers: { 'Authorization': AUTHTOKEN },
            }
        );
        return response;
    } catch (error) {
        throw new Error('Failed to fetchPastEnslavedApiService data');
    }
}
