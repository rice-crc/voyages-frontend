import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AUTHTOKEN = `Token ba4a9c10dd8685860fd97f47f505e39bc135528a`
const BASEURL   = `https://voyages3-api.crc.rice.edu/`
export const voyagesApi = createApi({
    reducerPath: "voyagesApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
    endpoints: (builder) => ({
        getOptions: builder.query({
            query: () => ({ 
            url: "voyage/?hierarchical=false",  
            method: "OPTIONS",
            headers: {'Authorization': AUTHTOKEN}}),
            transformResponse: (response) => {
                return  response
            }
        }),
        getRangeSlider: builder.query({
            query: (data) => ({ 
                url: "voyage/aggregations",  
                method: "POST",
                body: new FormData(data),// data,
                headers: {'Authorization': AUTHTOKEN}}),
                transformResponse: (response) => {
                    console.log('response--',response)
                    return  response
                }
        })
    }),
});


export const { useGetOptionsQuery , useGetRangeSliderQuery} = voyagesApi;