import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchOwnerOutcomeList = async () => {
  try {
    const response = await axios.get(`${BASEURL}/voyage/OwnerOutcomeList/`, {
      headers: { Authorization: AUTHTOKEN },
    });
    return response;
  } catch (error) {
    throw new Error('Failed to fetchOwnerOutcomeList data');
  }
};
