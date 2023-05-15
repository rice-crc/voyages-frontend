
import { useGetRangeSliderQuery } from '../fetchAPI/fetchApiService';
export default function useRangeSlider(aggregations: string) {
    const response = useGetRangeSliderQuery(aggregations);
    return response;
}