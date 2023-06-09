import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { getEnumColumnParams } from "../../utils/getEnumColumnParams";
import rowData from "../../utils/data";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/style/table.scss";

const boolEnum = {
  true: "Yes",
  false: "No",
};

const colorEnum = {
  "#ff0000": "Red",
  "#00ff00": "Green",
  "#0000ff": "Blue",
};

type GridData = {
  id: string;
  isActive: boolean;
  color: string;
  name: string;
};

const App = () => {
  const columnDefs: ColDef<GridData>[] = [
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "isActive",
      headerName: "Active",
      cellRenderer: "booleanCellRenderer",
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["true", "false"],
      },
    },
    {
      field: "color",
      headerName: "Color",
      cellRenderer: "colorCellRenderer",
    },
  ];

  const frameworkComponents = {
    booleanCellRenderer: "booleanCellRenderer",
    colorCellRenderer: "colorCellRenderer",
  };

  const [api, setApi] = useState<any>(null);
  const [columnApi, setColumnApi] = useState<any>(null);

  useEffect(() => {
    if (api && columnApi) {
      // Perform any necessary operations with the API and Column API
    }

    return () => {
      // Cleanup function
    };
  }, [api, columnApi]);
  const onGridReady = (params: any) => {
    setApi(params.api);
    setColumnApi(params.columnApi);
  };

  return (
    <div className="grid-container">
      <div id="myGrid" className="ag-grid ag-theme-alpine">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          suppressRowClickSelection
          defaultColDef={{
            sortable: true,
            flex: 1,
            minWidth: 200,
            resizable: true,
            cellClass: "cell-wrap-text ag-grid-cell",
            autoHeight: true,
            filter: "agTextColumnFilter",
            filterParams: {
              buttons: ["reset", "apply"],
              closeOnApply: true,
              suppressAndOrCondition: true,
            },
          }}
          columnTypes={{
            booleanColumn: {
              ...getEnumColumnParams(boolEnum),
            },
            colorColumn: {
              ...getEnumColumnParams(colorEnum),
            },
          }}
          animateRows
          rowModelType="clientSide"
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default App;
