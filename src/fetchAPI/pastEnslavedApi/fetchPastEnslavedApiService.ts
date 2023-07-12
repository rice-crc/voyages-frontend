import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { Options } from '@vitejs/plugin-react-refresh';

export const pastEnslavedApi = createApi({
    reducerPath: 'pastEnslavedApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
    endpoints: (builder) => ({
        getOptions: builder.query({
            query: () => ({
                url: 'past/enslaver/?hierarchical=False',
                method: 'OPTIONS',
                headers: { 'Authorization': AUTHTOKEN }
            }),
            transformResponse: (response: Options) => {
                return response
            },
        })
    })
});

export const { useGetOptionsQuery } = pastEnslavedApi;