import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASEURL = import.meta.env.VITE_API_URL;
const AUTHTOKEN = import.meta.env.VITE_API_KEY;

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
        }),
        getRangeSlider: builder.query({
            query: (data) => ({
                url: "voyage/aggregations",
                method: "POST",
                body: data,
                headers: { 'Authorization': AUTHTOKEN }
            }),
            transformResponse: (response) => {
                return response
            },
        }),
    })
});

export const { useGetOptionsQuery, useGetRangeSliderQuery } = voyagesApi;