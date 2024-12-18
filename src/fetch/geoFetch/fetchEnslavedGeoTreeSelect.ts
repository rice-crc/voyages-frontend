import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { GeoTreeSelectStateProps } from '@/share/InterfaceTypes';

export const fetchEnslavedGeoTreeSelect = async (
  dataSend?: GeoTreeSelectStateProps
) => {
  const response = await axios.post(
    `${BASEURL}/past/enslaved/geotree/`,
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
