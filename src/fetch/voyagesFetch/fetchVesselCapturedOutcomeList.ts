import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchVesselCapturedOutcomeList = async () => {
  try {
    const response = await axios.get(
      `${BASEURL}/voyage/VesselCapturedOutcomeList/`,
      {
        headers: { Authorization: AUTHTOKEN },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Failed to fetchVesselCapturedOutcomeList data');
  }
};
