import { useQuery } from 'react-query';

import { fetchVoyageGraphGroupby } from '@/fetch/voyagesFetch/fetchVoyageGroupby';
import { IRootFilterObjectScatterRequest } from '@/share/InterfaceTypes';

export const useGroupBy = (dataSend: IRootFilterObjectScatterRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['autoComplete', dataSend],
    queryFn: () => fetchVoyageGraphGroupby(dataSend),
  });

  return { data, isLoading, isError };
};
