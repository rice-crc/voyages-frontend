import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTHTOKEN, BASEURL } from '../../share/AUTH_BASEURL';
import { Options } from '@vitejs/plugin-react-refresh';

export const pastEnslavedApiService = createApi({
    reducerPath: 'pastEnslavedApiService',
    baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
    endpoints: (builder) => ({
        getOptions: builder.query({
            query: () => ({
                url: 'past/enslaved/?hierarchical=False',
                method: 'OPTIONS',
                headers: { 'Authorization': AUTHTOKEN }
            }),
            transformResponse: (response: Options) => {
                return response
            },
        })
    })
});

export const { useGetOptionsQuery } = pastEnslavedApiService;