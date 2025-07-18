import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchEnslavedGenderList = async () => {
  try {
    const response = await axios.get(
      `${BASEURL}/past/GenderList/`,
      {
        headers: { Authorization: AUTHTOKEN },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Failed to fetchEnslavedGenderList data');
  }
};
