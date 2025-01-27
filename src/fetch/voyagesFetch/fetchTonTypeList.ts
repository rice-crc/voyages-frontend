import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchTonTypeList = async () => {
  try {
    const response = await axios.get(`${BASEURL}/voyage/TonTypeList/`, {
      headers: { Authorization: AUTHTOKEN },
    });
    return response;
  } catch (error) {
    throw new Error('Failed to fetchTonTypeList data');
  }
};
