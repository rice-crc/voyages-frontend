import axios from 'axios';

import { IRootFilterObjectScatterRequest } from '@/share/InterfaceTypes';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchVoyageGraphGroupby = async (
  dataSend?: IRootFilterObjectScatterRequest,
) => {
  const response = await axios.post(`${BASEURL}/voyage/groupby/`, dataSend, {
    headers: {
      Authorization: AUTHTOKEN,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
