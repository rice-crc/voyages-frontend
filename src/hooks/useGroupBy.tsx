
import { fetchVoyageGraphGroupby } from "@/fetch/voyagesFetch/fetchVoyageGroupby";
import { IRootFilterObjectScatterRequest } from "@/share/InterfaceTypes";
import { useQuery } from "react-query";

export const useGroupBy = (dataSend: IRootFilterObjectScatterRequest) => {
    const { data, isLoading, isError } = useQuery(
        {
            queryKey: ['autoComplete', dataSend],
            queryFn: () => fetchVoyageGraphGroupby(dataSend)
        }
    );
    return { data, isLoading, isError };
};
