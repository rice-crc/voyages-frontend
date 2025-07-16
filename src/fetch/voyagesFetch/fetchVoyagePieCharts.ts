import axios from 'axios';

import { IRootFilterObjectRequest } from '@/share/InterfaceTypes';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchVoyagePieCharts = async (
  dataSend?: IRootFilterObjectRequest,
) => {
  const response = await axios.post(`${BASEURL}/voyage/piecharts/`, dataSend, {
    headers: {
      Authorization: AUTHTOKEN,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
