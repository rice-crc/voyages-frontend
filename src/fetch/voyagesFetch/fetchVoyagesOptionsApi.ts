import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchVoyagesOptionsApi = async () => {
  try {
    const response = await axios.get(
      `${BASEURL}/common/schemas/?schema_name=Voyage&hierarchical=False/`,
      {
        headers: { Authorization: AUTHTOKEN },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Failed to fetchVoyagesOptionsApi data');
  }
};
