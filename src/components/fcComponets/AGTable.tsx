import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/style/table.scss";
import CustomHeader from "./customHeader";
import TABLE_FLAT from "@/utils/example_voyages_table_flatfile.json";
import { TableColumnProps } from "@/share/InterfaceTypes";

const AGTable: React.FC = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: 500, width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<any[]>([
    { field: "athlete", suppressMenu: true, minWidth: 120 },
    {
      field: "age",
      sortable: false,
      headerComponentParams: { menuIcon: "fa-external-link-alt" },
    },
    { field: "country", suppressMenu: true, minWidth: 120 },
    { field: "year", sortable: false },
    { field: "date", suppressMenu: true },
    { field: "sport", sortable: false },
    {
      field: "gold",
      headerComponentParams: { menuIcon: "fa-cog" },
      minWidth: 120,
    },
    { field: "silver", sortable: false },
    { field: "bronze", suppressMenu: true, minWidth: 120 },
    { field: "total", sortable: false },
  ]);
  const components = useMemo(() => {
    return {
      agColumnHeader: CustomHeader,
    };
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
      headerComponentParams: {
        menuIcon: "fa-bars",
      },
    };
  }, []);

  const onGridReady = useCallback(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        // console.log("data", data);
        setRowData(data);
      });
  }, []);

  const VoyageTableFlatData = useCallback(() => {
    TABLE_FLAT.forEach((value: TableColumnProps) => {});
  }, []);

  useEffect(() => {
    VoyageTableFlatData();
  }, []);

  // console.log("columnDefs", columnDefs);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          suppressMenuHide={true}
          components={components}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};
export default AGTable;
