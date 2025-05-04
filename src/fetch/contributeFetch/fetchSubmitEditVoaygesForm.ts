import axios from 'axios';
import { AUTHTOKEN, BASEURLNODE } from '@/share/AUTH_BASEURL';
// const res = await fetch(
//   `http://localhost:7127/materialize/Voyage/${voyageId}`,
// );
export const fetchSubmitEditVoaygesForm = async (
  voyageId: string
) => {
  const response = await axios.get(
    `${BASEURLNODE}/materialize/Voyage/${voyageId}`,
    {
      headers: {
        Authorization: AUTHTOKEN,
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
};
