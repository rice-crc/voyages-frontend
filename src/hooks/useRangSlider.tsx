import { fetchPastEnslavedRangeSliderData } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedRangeSliderData';
import { fetchPastEnslaversRangeSliderData } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversRangeSliderData';
import { fetchRangeVoyageSliderData } from '@/fetch/voyagesFetch/fetchRangeSliderData';
import { RangeSliderStateProps } from '@/share/InterfaceTypes';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { useQuery } from 'react-query';

export const useRangSlider = (
  dataSend: RangeSliderStateProps | undefined,
  styleName?: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['rangSlider', dataSend],
    queryFn: () => {
      if (checkPagesRouteForVoyages(styleName!)) {
        return fetchRangeVoyageSliderData(dataSend);
      } else if (checkPagesRouteForEnslaved(styleName!)) {
        return fetchPastEnslavedRangeSliderData(dataSend);
      } else if (checkPagesRouteForEnslavers(styleName!)) {
        return fetchPastEnslaversRangeSliderData(dataSend);
      }
    },
  });
  return { data, isLoading, isError };
};
