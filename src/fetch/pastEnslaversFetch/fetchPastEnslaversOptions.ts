import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';

export const fetchPastEnslaversOptions = async () => {
  try {
    const response = await axios.get(
      `${BASEURL}/common/schemas/?schema_name=Enslaver&hierarchical=False`,
      {
        headers: { Authorization: AUTHTOKEN },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Failed to fetchPastEnslaversOptions data');
  }
};
