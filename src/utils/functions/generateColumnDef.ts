import { TableCellStructure } from "@/share/InterfaceTypesTable";
import { ICellRendererParams } from "ag-grid-community";
import { generateCellTableRenderer } from "./generateCellTableRenderer";
import { hasValueGetter } from "./hasValueGetter";

export const generateColumnDef = (value: TableCellStructure, visibleColumnCells: string[]) => {
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
        cellRenderer: generateCellTableRenderer(),
        valueGetter: (params: ICellRendererParams) => hasValueGetter(params, value),
    };
};
