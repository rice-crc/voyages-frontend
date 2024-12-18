import { useQuery } from 'react-query';
import { TableListPropsRequest } from '@/share/InterfaceTypes';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';

export const useTableData = (
  dataSend: TableListPropsRequest,
  styleNameRoute: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tableData', dataSend],
    queryFn: () => {
      if (checkPagesRouteForVoyages(styleNameRoute!)) {
        return fetchVoyageOptionsAPI(dataSend);
      } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
        return fetchEnslavedOptionsList(dataSend);
      } else if (checkPagesRouteForEnslavers(styleNameRoute!)) {
        return fetchEnslaversOptionsList(dataSend);
      }
    },
  });
  return { data, isLoading, isError };
};
