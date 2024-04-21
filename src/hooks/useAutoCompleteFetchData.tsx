import { fetchPastEnslavedAutoComplete } from "@/fetch/pastEnslavedFetch/fetchPastEnslavedAutoCompleted";
import { fetchPastEnslaversAutoCompleted } from "@/fetch/pastEnslaversFetch/fetchPastEnslaversAutoCompleted";
import { fetchAutoVoyageComplete } from "@/fetch/voyagesFetch/fetchAutoVoyageComplete";
import { IRootFilterObject } from "@/share/InterfaceTypes";
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from "@/utils/functions/checkPagesRoute";

import { useQuery } from "react-query";

export const useAutoCompleteFetchData = (dataSend: IRootFilterObject | undefined, styleName?: string) => {
    const { data, isLoading, isError } = useQuery(
        {
            queryKey: ['autoComplete', dataSend],
            queryFn: () => {
                if (checkPagesRouteForVoyages(styleName!)) {
                    return fetchAutoVoyageComplete(dataSend);
                } else if (checkPagesRouteForEnslaved(styleName!)) {
                    return fetchPastEnslavedAutoComplete(dataSend);
                } else if (checkPagesRouteForEnslavers(styleName!)) {
                    return fetchPastEnslaversAutoCompleted(dataSend);
                }
            }
        }
    );
    return { data, isLoading, isError };
};
