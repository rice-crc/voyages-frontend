import axios from 'axios';

import { FilterEnslavedVoyageOutcomeRequest } from '@/share/InterfaceTypes';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchEnslavedVoyageOutcome = async (
  dataSend?: FilterEnslavedVoyageOutcomeRequest,
) => {
  const response = await axios.post(
    `${BASEURL}/past/EnslavedVoyageOutcome/`,
    dataSend,
    {
      headers: {
        Authorization: AUTHTOKEN,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};
