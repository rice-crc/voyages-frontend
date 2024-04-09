import { TableCellStructure } from "@/share/InterfaceTypesTable";
import { ICellRendererParams } from "ag-grid-community";
import { hasValueGetter } from "./hasValueGetter";
import { GenerateCellTableRenderer } from "@/components/PresentationComponents/Tables/GenerateCellTableRenderer";
import { calculateWidthColumnDef } from "./calculateWidthColumnDef";

export const generateColumnDef = (value: TableCellStructure, visibleColumnCells?: string[]) => {
    const nodeClass = value?.cell_val?.fields[0]?.node_class;
    const CELLFN = value?.cell_val?.fields[0]?.cell_fn;
    const colID = value.colID
    const width = calculateWidthColumnDef(value, colID)

    return {
        headerName: value.header_label,
        field: value.colID,
        width: width,
        sortable: true,
        autoHeight: true,
        wrapText: true,
        resizable: true,
        sortingOrder: value.order_by,
        headerTooltip: value.header_label,
        tooltipField: value.colID,
        hide: !visibleColumnCells!.includes(value.colID),
        filter: true,
        cellRenderer: (params: ICellRendererParams) => GenerateCellTableRenderer(params, CELLFN, colID, nodeClass),
        valueGetter: (params: ICellRendererParams) => hasValueGetter(params, value),
    };
};

