import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { RangeSliderStateProps } from '@/share/InterfaceTypes';

export const fetchPastEnslavedRangeSliderData = async (
  dataSend?: RangeSliderStateProps
) => {
  const response = await axios.post(
    `${BASEURL}/past/enslaved/aggregations/`,
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
