import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchSearchGlobalApi = async (formData: FormData, signal: AbortSignal) => {
    try {
        const response = await axios.post(`${BASEURL}common/global/`, formData, {
            headers: { 'Authorization': AUTHTOKEN },
            signal: signal
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch fetchSearchGlobalApi data');
    }
};
