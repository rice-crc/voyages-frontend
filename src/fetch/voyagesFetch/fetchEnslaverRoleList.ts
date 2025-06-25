import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchEnslaverRoleList = async () => {
  try {
    const response = await axios.get(
      `${BASEURL}/past/enslaver/EnslaverRoleList/`,
      {
        headers: { Authorization: AUTHTOKEN },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Failed to fetchEnslaverRoleList data');
  }
};
