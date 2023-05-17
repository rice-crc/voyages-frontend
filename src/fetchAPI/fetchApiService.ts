import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTHTOKEN, BASEURL } from "../share/AUTH_BASEURL";

export const voyagesApi = createApi({
    reducerPath: "voyagesApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
    endpoints: (builder) => ({
        getOptions: builder.query({
            query: () => ({
                url: "voyage/?hierarchical=false",
                method: "OPTIONS",
                headers: { 'Authorization': AUTHTOKEN }
            }),
            transformResponse: (response) => {
                return response
            }
        })
    })
});

export const { useGetOptionsQuery } = voyagesApi;