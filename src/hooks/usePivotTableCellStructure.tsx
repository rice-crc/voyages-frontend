import { useQuery } from 'react-query';
import { PivotTablesPropsRequest } from '@/share/InterfaceTypes';
import { fetchPivotCrosstabsTables } from '@/fetch/voyagesFetch/fetchPivotCrosstabsTables';

export const usePivotTableCellStructure = (
  dataSend: PivotTablesPropsRequest,
  styleNameRoute?: string
) => {
  const { data, isLoading, isError } = useQuery(
    ['pivotTableCellStructure', dataSend!],
    () => fetchPivotCrosstabsTables(dataSend!)
  );
  return { data, isLoading, isError };
};
