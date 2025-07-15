import { useQuery } from 'react-query';

import { fetchVoyagePieCharts } from '@/fetch/voyagesFetch/fetchVoyagePieCharts';
import { IRootFilterObjectRequest } from '@/share/InterfaceTypes';

export const useFetchPieCharts = (dataSend: IRootFilterObjectRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['autoComplete', dataSend],
    queryFn: () => fetchVoyagePieCharts(dataSend),
  });

  return { data, isLoading, isError };
};
