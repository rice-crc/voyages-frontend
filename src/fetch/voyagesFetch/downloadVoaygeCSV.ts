import axios from 'axios';

import { TableListPropsRequest } from '@/share/InterfaceTypes';

import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const downloadVoaygeCSV = async (dataSend?: TableListPropsRequest) => {
  try {
    const response = await axios.post(
      `${BASEURL}/voyage/VoyageDownload/`,
      dataSend,
      {
        headers: {
          Authorization: AUTHTOKEN,
          'Content-Type': 'application/json',
        },
      },
    );
    return response;
  } catch {
    throw new Error('Failed to downloadCSVFetch data');
  }
};
