import axios from 'axios';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchCargoTypeListList = async () => {
  try {
    const response = await axios.get(`${BASEURL}/voyage/CargoTypeList/`, {
      headers: { Authorization: AUTHTOKEN },
    });
    return response;
  } catch {
    throw new Error('Failed to fetchCargoTypeListList data');
  }
};
