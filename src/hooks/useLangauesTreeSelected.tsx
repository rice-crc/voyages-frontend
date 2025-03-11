import { LanguageTreeSelectProps } from '@/share/InterfaceTypes';
import { useQuery } from 'react-query';
import { fetchEnslavedLanguageTreeSelect } from '@/fetch/geoFetch/fetchEnslavedLanguageTreeSelect';

export const useLangauesTreeSelected = (
  dataSend: LanguageTreeSelectProps | undefined
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['geoTreeSelected', dataSend],
    queryFn: () => {
      return fetchEnslavedLanguageTreeSelect(dataSend);
    },
  });
  return { data, isLoading, isError };
};
