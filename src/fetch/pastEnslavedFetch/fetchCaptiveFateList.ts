import axios from 'axios';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchCaptiveFateList = async () => {
  try {
    const response = await axios.get(`${BASEURL}/past/CaptiveFateList/`, {
      headers: { Authorization: AUTHTOKEN },
    });
    return response;
  } catch {
    throw new Error('Failed to fetchCaptiveFateList data');
  }
};
