import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import TABLE_FLAT from "@/utils/example_voyages_table_flatfile.json";
import {
  ColumnDef,
  ColumnObjectProps,
  RowData,
  TableColumnProps,
} from "@/share/InterfaceTypes";
import "@/style/table.scss";
import { fetchVoyageOptionsPagination } from "@/fetchAPI/fetchVoyageOptionsPagination";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import CustomHeader from "./customHeader";
import { createRowData } from "@/utils/createRowData";
import { VoyageOptionsGropProps } from "@/share/InterfaceTypesTable";

const Table: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: 500, width: "100%" }), []);
  const [data, setData] = useState<VoyageOptionsGropProps[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColumnDef[]>([]);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [tableOptions, setTableOptions] = useState<ColumnObjectProps>({});
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: false,
      resizable: true,
      headerComponentParams: {
        menuIcon: "fa-bars",
      },
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append("results_page", "1"); // results_page will set function to set which page we on
      newFormData.append("results_per_page", "10"); // results_per_page will set function to select how many per page
      try {
        const response = await dispatch(
          fetchVoyageOptionsPagination(newFormData)
        ).unwrap();
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const VoyageTableOptions = useCallback(() => {
    const columnObject: ColumnObjectProps = {};
    TABLE_FLAT.map((value: TableColumnProps) => {
      const cellFields = value.cell_fields.display.split("__");
      columnObject[cellFields[0]] = cellFields[1];
    });
    setTableOptions({
      ...tableOptions,
      ...columnObject,
    });
    return columnObject;
  }, []);

  const components = useMemo(() => {
    return {
      agColumnHeader: CustomHeader,
    };
  }, []);

  function hashValueGetter(params: any) {
    const fieldName = params.colDef.field;
    const regex = /__(.+)/;
    const match = fieldName.match(regex);
    const cellFields = match ? match[1] : "";
    const tableVal = Object.values(tableOptions); // Need to check if value change from
    const rowData = params.data;
    if (tableVal.includes(cellFields)) {
      return rowData[cellFields];
    }
    return null;
  }

  useEffect(() => {
    VoyageTableOptions();
    // Generate column definitions
    if (data.length > 0) {
      const columns: ColumnDef[] = [];
      TABLE_FLAT.forEach((key) => {
        const columnDef = {
          headerName: key.header_label,
          valueGetter: hashValueGetter,
          field: key.cell_fields.display,
          sortable: true,
          resizable: true,
          filter: true,
          //   maxWidth: 150,
          rowData: createRowData(data, tableOptions),
        };
        columns.push(columnDef);
      });

      setColumnDefs(columns);
      setRowData(createRowData(data, tableOptions));
    }
  }, [data]);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          suppressMenuHide={true}
          defaultColDef={defaultColDef}
          components={components}
        />
      </div>
    </div>
  );
};

export default Table;
