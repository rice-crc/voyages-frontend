import axios from 'axios';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchParticularOutcomeList = async () => {
  try {
    const response = await axios.get(
      `${BASEURL}/voyage/ParticularOutcomeList/`,
      {
        headers: { Authorization: AUTHTOKEN },
      },
    );
    return response;
  } catch {
    throw new Error('Failed to fetchParticularOutcomeList data');
  }
};
