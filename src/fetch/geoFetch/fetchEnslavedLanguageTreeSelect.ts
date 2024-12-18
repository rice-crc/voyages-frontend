import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { LanguageTreeSelectProps } from '@/share/InterfaceTypes';

export const fetchEnslavedLanguageTreeSelect = async (
  dataSend?: LanguageTreeSelectProps
) => {
  const response = await axios.post(
    `${BASEURL}/past/enslaved/languagegrouptree/`,
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
