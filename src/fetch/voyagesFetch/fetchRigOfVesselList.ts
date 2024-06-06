import axios from 'axios';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';

export const fetchRigOfVesselList = async () => {
    try {
        const response = await axios.get(
            `${BASEURL}/voyage/RigOfVesselList/`,
            {
                headers: { 'Authorization': AUTHTOKEN },
            }
        );
        return response;
    } catch (error) {
        throw new Error('Failed to fetchRigOfVesselList data');
    }
};