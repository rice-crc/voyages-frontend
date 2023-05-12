import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const voyagesApi = createApi({
    reducerPath: "voyagesApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://voyages3-api.crc.rice.edu/" }),
    endpoints: (builder) => ({
        getOptions: builder.query({
            query: () => ({ 
            url: "voyage/?hierarchical=false",  
            method: "OPTIONS",
            headers: {'Authorization': 'Token ba4a9c10dd8685860fd97f47f505e39bc135528a'}}),
            transformResponse: (response) => {
                return  response
            }
        }),
    }),
});


export const { useGetOptionsQuery} = voyagesApi;