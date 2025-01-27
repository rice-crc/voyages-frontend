import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { IRootFilterObject } from '@/share/InterfaceTypes';

export const fetchBlogAutoCompleted = async (dataSend?: IRootFilterObject) => {
  const response = await axios.post(`${BASEURL}/blog/autocomplete/`, dataSend, {
    headers: {
      Authorization: AUTHTOKEN,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
