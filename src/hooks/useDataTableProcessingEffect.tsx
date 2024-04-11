import { setColumnDefs, setRowData } from '@/redux/getTableSlice';
import { AppDispatch } from '@/redux/store';
import { TableCellStructure } from '@/share/InterfaceTypesTable';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { generateColumnDef } from '@/utils/functions/generateColumnDef';
import { generateRowsData } from '@/utils/functions/generateRowsData';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePageRouter } from './usePageRouter';

function useDataTableProcessingEffect(
    data: Record<string, any>[],
    visibleColumnCells: string[],
    tableFlatfileVoyages: string,
    tableFlatfileEnslaved: string,
    tableFlatfileEnslavers: string,
    tablesCell: TableCellStructure[],
) {
    const dispatch: AppDispatch = useDispatch();
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

            const newColumnDefs = tablesCell.map(
                (value) =>
                    generateColumnDef(value, visibleColumnCells)
            );
            dispatch(setColumnDefs(newColumnDefs));
            dispatch(setRowData(finalRowData as Record<string, any>[]));
        } else {
            dispatch(setRowData([]));
        }
        // Ensure to return undefined if there's no cleanup needed
        return undefined;
    }, [
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
