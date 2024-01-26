import { GeoTreeSelectStateProps } from "@/share/InterfaceTypes";
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from "@/utils/functions/checkPagesRoute";
import { useQuery } from "react-query";
import { fetcVoyagesGeoTreeSelectLists } from '@/fetch/geoFetch/fetchVoyagesGeoTreeSelect';
import { fetchEnslavedGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslavedGeoTreeSelect';
import { fetchEnslaversGeoTreeSelect } from '@/fetch/geoFetch/fetchEnslaversGeoTreeSelect';

export const useGeoTreeSelected = (dataSend: GeoTreeSelectStateProps | undefined, styleName?: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['geoTreeSelected', dataSend],
        queryFn: () => {
            if (checkPagesRouteForVoyages(styleName!)) {
                return fetcVoyagesGeoTreeSelectLists(dataSend);
            } else if (checkPagesRouteForEnslaved(styleName!)) {
                return fetchEnslavedGeoTreeSelect(dataSend);
            } else if (checkPagesRouteForEnslavers(styleName!)) {
                return fetchEnslaversGeoTreeSelect(dataSend);
            }
        }
    })
    return { data, isLoading, isError };
}