import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchNationalityList = async () => {
  try {
    const response = await axios.get(`${BASEURL}/voyage/NationalityList/`, {
      headers: { Authorization: AUTHTOKEN },
    });
    return response;
  } catch (error) {
    throw new Error('Failed to fetchNationalityList data');
  }
};
