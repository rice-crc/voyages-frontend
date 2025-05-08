import axios from 'axios';
import { AUTHTOKEN, BASEURLNODE } from '@/share/AUTH_BASEURL';

export const fetchEnumeration = async (
  schema: string
) => {
  const response = await axios.get(
    `${BASEURLNODE}/enumerate/${schema}`,
    {
      headers: {
        Authorization: AUTHTOKEN,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
