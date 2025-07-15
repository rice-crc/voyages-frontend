import axios from 'axios';

import { IRootFilterLineAndBarRequest } from '@/share/InterfaceTypes';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchVoyageLineAndBarCharts = async (
  dataSend?: IRootFilterLineAndBarRequest,
) => {
  const response = await axios.post(
    `${BASEURL}/voyage/lineandbarcharts/`,
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
