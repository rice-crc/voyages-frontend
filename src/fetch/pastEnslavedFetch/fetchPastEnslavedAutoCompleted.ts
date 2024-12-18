import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { IRootFilterObject } from '@/share/InterfaceTypes';

export const fetchPastEnslavedAutoComplete = async (
  dataSend?: IRootFilterObject
) => {
  const response = await axios.post(
    `${BASEURL}/past/enslaved/autocomplete/`,
    dataSend,
    {
      headers: {
        Authorization: AUTHTOKEN,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
