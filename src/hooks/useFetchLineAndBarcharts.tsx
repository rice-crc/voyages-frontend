import { useQuery } from 'react-query';

import { fetchVoyageLineAndBarCharts } from '@/fetch/voyagesFetch/fetchVoyageLineAndBarCharts';
import { IRootFilterLineAndBarRequest } from '@/share/InterfaceTypes';

export const useFetchLineAndBarcharts = (
  dataSend: IRootFilterLineAndBarRequest,
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['autoComplete', dataSend],
    queryFn: () => fetchVoyageLineAndBarCharts(dataSend),
  });

  return { data, isLoading, isError };
};
