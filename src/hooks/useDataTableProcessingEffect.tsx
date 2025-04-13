import { setColumnDefs, setRowData } from '@/redux/getTableSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { TableCellStructure } from '@/share/InterfaceTypesTable';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { generateColumnDef } from '@/utils/functions/generateColumnDef';
import { generateRowsData } from '@/utils/functions/generateRowsData';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageRouter } from './usePageRouter';

function useDataTableProcessingEffect(
  data: Record<string, any>[],
  visibleColumnCells: string[],
  tableFlatfileVoyages: string,
  tableFlatfileEnslaved: string,
  tableFlatfileEnslavers: string,
  tablesCell: TableCellStructure[]
) {
  const dispatch: AppDispatch = useDispatch();
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const { styleName: styleNameRoute } = usePageRouter();
  useEffect(() => {
    const tableFileName = checkPagesRouteForVoyages(styleNameRoute!)
      ? tableFlatfileVoyages
      : checkPagesRouteForEnslaved(styleNameRoute!)
        ? tableFlatfileEnslaved
        : checkPagesRouteForEnslavers(styleNameRoute!)
          ? tableFlatfileEnslavers
          : null;

    if (data.length > 0) {
      const finalRowData = generateRowsData(data, tableFileName!);
      // Generate column definitions
      let newColumnDefs = tablesCell.map((value) =>
        generateColumnDef(value, languageValue, visibleColumnCells)
      );
      
      // Try to preserve column order from localStorage if this is initial load
      const savedColumnState = localStorage.getItem('columnState');
      if (savedColumnState) {
        try {
          const parsedState = JSON.parse(savedColumnState);
          
          // Sort column definitions based on saved state if column IDs match
          const colIds = parsedState.map((col: any) => col.colId);
          if (colIds.length > 0) {
            // Create a map of column positions
            const colPositions = colIds.reduce((acc: any, id: string, index: number) => {
              acc[id] = index;
              return acc;
            }, {});
            
            // Sort the column definitions based on the saved positions
            newColumnDefs.sort((a, b) => {
              const posA = colPositions[a.field] ?? Number.MAX_SAFE_INTEGER;
              const posB = colPositions[b.field] ?? Number.MAX_SAFE_INTEGER;
              return posA - posB;
            });
          }
        } catch (error) {
          console.error('Error parsing saved column state:', error);
        }
      }
      
      dispatch(setColumnDefs(newColumnDefs));
      dispatch(setRowData(finalRowData as Record<string, any>[]));
    } else {
      dispatch(setRowData([]));
    }
    // Ensure to return undefined if there's no cleanup needed
    return undefined;
  }, [
    languageValue,
    data,
    visibleColumnCells,
    dispatch,
    tableFlatfileVoyages,
    tableFlatfileEnslaved,
    tableFlatfileEnslavers,
    tablesCell
  ]);
}

export default useDataTableProcessingEffect;
