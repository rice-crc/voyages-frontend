import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { TableListPropsRequest } from '@/share/InterfaceTypes';

export const downloadVoaygeCSV = async (dataSend?: TableListPropsRequest) => {
    try {
        const response = await axios.post(`${BASEURL}/voyage/VoyageDownload/`, dataSend, {
          headers: {
            Authorization: AUTHTOKEN,
            'Content-Type': 'application/json',
          },
        });
    return response;
  } catch (error) {
    throw new Error('Failed to downloadCSVFetch data');
  }
};
