import axios from 'axios';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchAfricanInfoList = async () => {
  try {
    const response = await axios.get(`${BASEURL}/voyage/AfricanInfoList/`, {
      headers: { Authorization: AUTHTOKEN },
    });
    return response;
  } catch {
    throw new Error('Failed to fetchAfricanInfoList data');
  }
};
