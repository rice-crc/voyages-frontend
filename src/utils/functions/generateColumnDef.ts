import { TableCellStructure } from "@/share/InterfaceTypesTable";
import { ICellRendererParams } from "ag-grid-community";
import { hasValueGetter } from "./hasValueGetter";
import { GenerateCellTableRenderer } from "@/components/FunctionComponents/GenerateCellTableRenderer";

export const generateColumnDef = (value: TableCellStructure, visibleColumnCells: string[]) => {
    const CELLFN = value?.cell_val?.fields[0]?.cell_fn
    return {
        headerName: value.header_label,
        field: value.colID,
        sortable: true,
        autoHeight: true,
        wrapText: true,
        sortingOrder: value.order_by,
        headerTooltip: value.header_label,
        tooltipField: value.colID,
        hide: !visibleColumnCells.includes(value.colID),
        filter: true,
        cellRenderer: (params: ICellRendererParams) => GenerateCellTableRenderer(params, value.colID, CELLFN),
        valueGetter: (params: ICellRendererParams) => hasValueGetter(params, value),
    };
};
