// 2. UPDATED useDataTableProcessingEffect.tsx - Clean, single responsibility
import { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

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
import { sortDataOnFrontend } from '@/utils/functions/sortDataOnFrontend';

import { usePageRouter } from './usePageRouter';

function useDataTableProcessingEffect(
  data: Record<string, any>[],
  visibleColumnCells: string[],
  tableFlatfileVoyages: string,
  tableFlatfileEnslaved: string,
  tableFlatfileEnslavers: string,
  tablesCell: TableCellStructure[],
  sortColumn?: string[], // Changed to accept full sort column array
) {
  const dispatch: AppDispatch = useDispatch();
  const isFirstProcessing = useRef(true);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
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
      // Always process the raw data first
      let finalRowData = generateRowsData(data, tableFileName!);

      // Apply sorting only if not first processing AND we have sort columns
      if (!isFirstProcessing.current && sortColumn && sortColumn.length > 0) {
        // console.log('🔄 Applying sorting in hook:', { sortColumn });

        // Extract sort info
        const firstSort = sortColumn[0];
        // console.log({ firstSort });
        const isDescending = firstSort.startsWith('-');
        const fieldName = isDescending ? firstSort.substring(1) : firstSort;
        const sortOrder = isDescending ? 'desc' : 'asc';

        finalRowData = sortDataOnFrontend(finalRowData, sortOrder, [fieldName]);

        // console.log('✅ Data sorted:', {
        //   sortOrder,
        //   first3: finalRowData.slice(0, 3).map((r) => r.voyage_id || r.id),
        // });
      } else if (isFirstProcessing.current) {
        isFirstProcessing.current = false;
      }

      // Generate column definitions
      const newColumnDefs = tablesCell.map((value) =>
        generateColumnDef(value, languageValue, visibleColumnCells),
      );

      // Handle saved column state
      const savedColumnState = localStorage.getItem('columnState');
      if (savedColumnState) {
        try {
          const parsedState = JSON.parse(savedColumnState);
          const colIds = parsedState.map((col: any) => col.colId);
          if (colIds.length > 0) {
            const colPositions = colIds.reduce(
              (acc: any, id: string, index: number) => {
                acc[id] = index;
                return acc;
              },
              {},
            );

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
      dispatch(setRowData(finalRowData as Record<string, never>[]));
    } else {
      dispatch(setRowData([] as Record<string, never>[]));
    }
  }, [
    languageValue,
    data,
    visibleColumnCells,
    dispatch,
    tableFlatfileVoyages,
    tableFlatfileEnslaved,
    tableFlatfileEnslavers,
    tablesCell,
    styleNameRoute,
    sortColumn, // Now depends on the full sort column array
  ]);
}

export default useDataTableProcessingEffect;
