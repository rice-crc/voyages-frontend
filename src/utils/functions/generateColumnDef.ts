import { TableCellStructure } from "@/share/InterfaceTypesTable";
import { ICellRendererParams } from "ag-grid-community";
import { hasValueGetter } from "./hasValueGetter";
import { GenerateCellTableRenderer } from "@/components/PresentationComponents/Tables/GenerateCellTableRenderer";
import { LabelFilterMeneList } from "@/share/InterfaceTypes";

export const generateColumnDef = (value: TableCellStructure, languageValue: string, visibleColumnCells?: string[]) => {
    const nodeClass = value?.cell_val?.fields[0]?.node_class;
    const CELLFN = value?.cell_val?.fields[0]?.cell_fn;
    const colID = value.colID
    const numberFormat = value.number_format
    const columnHeader = (value.header_label as LabelFilterMeneList)[languageValue];

    return {
        headerName: columnHeader,
        field: value.colID,
        width: value.col_width_px,
        sortable: true,
        autoHeight: true,
        wrapText: true,
        resizable: true,
        sortingOrder: value.order_by,
        col_width_px: value.col_width_px,
        headerTooltip: columnHeader,
        tooltipField: value.colID,
        hide: !visibleColumnCells!.includes(value.colID),
        filter: true,
        cellRenderer: (params: ICellRendererParams) => GenerateCellTableRenderer(params, CELLFN, colID, numberFormat, nodeClass),
        valueGetter: (params: ICellRendererParams) => hasValueGetter(params, value),
    };
};

