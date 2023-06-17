import React, {
  CSSProperties,
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import TABLE_FLAT from "@/utils/voyages_example_table_flatfile.json";
import { fetchVoyageOptionsPagination } from "@/fetchAPI/fetchVoyageOptionsPagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CustomHeader from "./customHeader";
import { generateRowsData } from "@/utils/generateRowsData";
import { ColumnDef, StateRowData } from "@/share/InterfaceTypesTable";
import { setColumnDefs, setRowData, setData } from "@/redux/getTableSlice";
import CustomTooltip from "./CustomTooltip";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/style/table.scss";

const Table: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { columnDefs, data, rowData } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(
    () => ({
      height: 500,
      width: "100%",
    }),
    []
  );
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const newFormData: FormData = new FormData();
      newFormData.append("results_page", "1");
      newFormData.append("results_per_page", "5");
      try {
        const response = await dispatch(
          fetchVoyageOptionsPagination(newFormData)
        ).unwrap();
        if (response) {
          dispatch(setData(response));
          setLoading(false);
        }
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (data.length > 0) {
      const finalRowData = generateRowsData(data);
      const columns: ColumnDef[] = [];

      TABLE_FLAT.forEach((value: any) => {
        const columnDef = {
          headerName: value.header_label,
          field: value.colID,
          cellRenderer: (params: any) => {
            const values = params.value;
            if (Array.isArray(values)) {
              const style: CSSProperties = {
                backgroundColor: "#e5e5e5",
                borderRadius: "8px",
                padding: "4px 6px",
                margin: "5px",
                height: 500,
                whiteSpace: "pre-line",
                overflow: "auto",
              };
              const renderedValues = values.map(
                (value: string, index: number) => (
                  <span key={index} style={style}>
                    {`${value}\n`}
                  </span>
                )
              );
              return <div>{renderedValues}</div>;
            } else {
              return values;
            }
          },
          valueGetter: (params: any) => {
            const finalData = [];
            const data = params.data;
            const fields = value.cell_val.fields;

            if (fields.length === 1) {
              return data[fields[0].var_name] ?? "--";
            } else {
              const joinDelimiter: string = value.cell_val.join;
              const firstData = data[fields[0].var_name];
              for (let i = 0; i < firstData?.length; i++) {
                const dataResult = [];
                for (let j = 0; j < fields.length; j++) {
                  const fieldName = fields[j].var_name;
                  const fieldValue = data[fieldName][i];
                  dataResult.push(String(fieldValue));
                }
                finalData.push(dataResult.join(joinDelimiter));
              }
            }
            return finalData.length !== 0 ? finalData : "--";
          },
          sortable: true,
          resizable: true,
          filter: true,
          tooltipValueGetter: tooltipValueGetter,
          tooltipComponent: CustomTooltip,
        };
        columns.push(columnDef);
      });
      dispatch(setColumnDefs(columns));
      dispatch(setRowData(finalRowData));
    }
  }, [data]);

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

  const components = useMemo(() => {
    return {
      agColumnHeader: CustomHeader,
    };
  }, []);

  const getRowRowStyle = (params: any) => {
    return {
      fontSize: 14,
      fontWeight: 500,
      color: "#000",
      fontFamily: `Roboto`,
    };
  };

  const tooltipValueGetter = (params: any) => ({ value: params.value });

  const getRowHeight = (params: any) => {
    const data = params.data;
    const lineHeight = 42;
    let numLines = 1;
    Object.entries(data).forEach(([key, value]) => {
      console.log("value", value);
      if (Array.isArray(value)) {
        numLines = value.length;
      }
    });
    return numLines * lineHeight;
  };

  const gridOptions = useMemo(
    () => ({
      getRowHeight,
    }),
    []
  );

  const onPageSizeChanged = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      gridRef.current.api.paginationSetPageSize(Number(value));
    },
    []
  );

  return (
    <div style={containerStyle}>
      {loading ? (
        <div>Loading data...</div>
      ) : (
        <>
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              rowData={rowData}
              gridOptions={gridOptions}
              columnDefs={columnDefs}
              suppressMenuHide={true}
              pagination={true}
              defaultColDef={defaultColDef}
              components={components}
              getRowStyle={getRowRowStyle}
            />
            {/* <div className="page-size">
              Page Size:
              <select onChange={onPageSizeChanged} id="page-size">
                <option value="10">10</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
