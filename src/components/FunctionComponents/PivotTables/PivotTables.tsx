import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useRef,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { SelectChangeEvent } from '@mui/material';
import VOYAGE_PIVOT_OPTIONS from '@/utils/flatfiles/VOYAGE_PIVOT_OPTIONS.json';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useWindowSize } from '@react-hook/window-size';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchApiPivotCrosstabsTables } from '@/fetchAPI/voyagesApi/fetchApiPivotCrosstabsTables';
import {
  setRowPivotTableData,
  setPivotTablColumnDefs,
} from '@/redux/getPivotTablesDataSlice';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  RangeSliderState,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';
import CustomHeader from '../CustomHeader';
import { AggregationSumAverage } from '@/components/Voyages/Results/AggregationSumAverage';

import {
  PivotRowVar,
  PivotColumnVar,
  PivotCellVar,
  PivotTablesProps,
} from '@/share/InterfaceTypes';
import { SelectDropdownPivotable } from './SelectDropdownPivotable';

const PivotTables = () => {
  const dispatch: AppDispatch = useDispatch();

  const [aggregation, setAggregation] = useState<string>('sum');
  const gridRef = useRef<AgGridReact>(null);
  const { columnDefs, rowData } = useSelector(
    (state: RootState) => state.getPivotTablesData
  );
  const { autoCompleteValue, autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const {
    rangeSliderMinMax: rang,
    varName,
    isChange,
  } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { dataSetKey, dataSetValue, styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { isChangeGeoTree, geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const components = useMemo(() => {
    return {
      agColumnHeader: CustomHeader,
    };
  }, []);
  const [width, height] = useWindowSize();
  const maxWidth = maxWidthSize(width);

  const [style, setStyle] = useState({
    width: maxWidth,
    height: height * 0.6,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [rowVars, setSelectRowValue] = useState<PivotRowVar[]>([]);
  const [columnVars, setSelectColumnValue] = useState<PivotColumnVar[]>([]);
  const [cellVars, setSelectCellValue] = useState<PivotCellVar[]>([]);
  const [pivotValueOptions, setPivotValueOptions] = useState<PivotTablesProps>({
    row_vars: VOYAGE_PIVOT_OPTIONS.row_vars[0].var_name,
    rows_label: VOYAGE_PIVOT_OPTIONS.row_vars[0].label,
    column_vars: VOYAGE_PIVOT_OPTIONS.column_vars[0].var_name,
    cell_vars: VOYAGE_PIVOT_OPTIONS.cell_vars[0].var_name,
    cachename: VOYAGE_PIVOT_OPTIONS.cachename,
  });

  const defaultColDef = useMemo(() => {
    return {
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const VoyagePivotTableOptions = useCallback(() => {
    Object.entries(VOYAGE_PIVOT_OPTIONS).forEach(([key, value]) => {
      if (key === 'row_vars' && Array.isArray(value)) {
        const pivotRowVars: PivotRowVar[] = value.map((item: any) => ({
          var_name: item.var_name,
          label: item.label,
        }));

        setSelectRowValue(pivotRowVars);
      } else if (key === 'column_vars' && Array.isArray(value)) {
        const pivotColumnVars: PivotColumnVar[] = value.map((item: any) => ({
          var_name: item.var_name,
          label: item.label,
        }));
        setSelectColumnValue(pivotColumnVars);
      } else if (key === 'cell_vars' && Array.isArray(value)) {
        const pivotCellVars: PivotCellVar[] = value.map((item: any) => ({
          var_name: item.var_name,
          label: item.label,
        }));
        setSelectCellValue(pivotCellVars);
      }
    });
  }, []);

  useEffect(() => {
    setStyle({
      width: maxWidth,
      height: height * 0.5,
    });
  }, [width, height, maxWidth]);

  useEffect(() => {
    VoyagePivotTableOptions();
    let subscribed = true;
    const {
      row_vars,
      rows_label,
      column_vars: columnVars,
      cell_vars,
      cachename,
    } = pivotValueOptions;
    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      for (const column of columnVars) {
        newFormData.append('columns', column);
      }
      newFormData.append('rows', row_vars);
      newFormData.append('rows_label', rows_label);
      newFormData.append('agg_fn', aggregation);
      newFormData.append('value_field', cell_vars);
      newFormData.append('cachename', cachename);

      if (inputSearchValue) {
        newFormData.append('global_search', String(inputSearchValue));
      }
      if (isChange && rang && currentPage === 6) {
        for (const rangKey in rang) {
          newFormData.append(rangKey, String(rang[rangKey][0]));
          newFormData.append(rangKey, String(rang[rangKey][1]));
        }
      }
      if (autoCompleteValue && varName && currentPage === 6) {
        for (const autoKey in autoCompleteValue) {
          for (const autoCompleteOption of autoCompleteValue[autoKey]) {
            if (typeof autoCompleteOption !== 'string') {
              const { label } = autoCompleteOption;

              newFormData.append(autoKey, label);
            }
          }
        }
      }

      if (isChangeGeoTree && varName && geoTreeValue && currentPage === 6) {
        for (const keyValue in geoTreeValue) {
          for (const keyGeoValue of geoTreeValue[keyValue]) {
            newFormData.append(keyValue, String(keyGeoValue));
          }
        }
      }

      if (styleName !== TYPESOFDATASET.allVoyages) {
        for (const value of dataSetValue) {
          newFormData.append(dataSetKey, String(value));
        }
      }
      setLoading(true);
      try {
        const response = await dispatch(
          fetchApiPivotCrosstabsTables(newFormData)
        ).unwrap();
        if (response && subscribed) {
          dispatch(setPivotTablColumnDefs(response.data.tablestructure));
          dispatch(setRowPivotTableData(response.data.data));
          setLoading(false);
        }
      } catch (error) {
        console.log('error', error);
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      dispatch(setPivotTablColumnDefs([]));
      dispatch(setRowPivotTableData([]));
      subscribed = false;
    };
  }, [
    pivotValueOptions.cell_vars,
    pivotValueOptions.column_vars,
    pivotValueOptions.row_vars,
    pivotValueOptions.rows_label,
    aggregation,
    varName,
    rang,
    currentPage,
    autoLabelName,
    dataSetValue,
    dataSetKey,
    geoTreeValue,
    isChange,
    styleName,
    inputSearchValue,
  ]);

  const gridOptions = useMemo(
    () => ({
      headerHeight: 40,
      suppressHorizontalScroll: false,
      onGridReady: (params: any) => {
        const { columnApi } = params;
        columnApi.autoSizeColumns();
      },
    }),
    []
  );
  const getRowRowStyle = () => {
    return {
      fontSize: 13,
      fontWeight: 500,
      color: '#000',
      fontFamily: `Roboto`,
      paddingLeft: '20px',
    };
  };
  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAggregation(event.target.value);
    },
    []
  );
  const handleChangeOptions = useCallback(
    (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setPivotValueOptions((prevVoyageOption) => ({
        ...prevVoyageOption,
        [name]: value,
      }));
    },
    []
  );

  const newRowsData = rowData.slice(0, -1);
  const pinnedBottomRowData: any[] = [rowData[rowData.length - 1]];

  const handleButtonExportCSV = useCallback(() => {
    (gridRef.current as AgGridReact<any>).api.exportDataAsCsv();
  }, []);

  return (
    <>
      <div className="ag-theme-alpine grid-container">
        <SelectDropdownPivotable
          selectedPivottablesOptions={pivotValueOptions}
          selectRowValue={rowVars}
          selectColumnValue={columnVars}
          selectCellValue={cellVars}
          handleChangeOptions={handleChangeOptions}
        />
        <div className="aggregation-export">
          <AggregationSumAverage
            handleChange={handleChangeAggregation}
            aggregation={aggregation}
          />
          <div className="button-export-csv">
            <button onClick={handleButtonExportCSV}>
              Download CSV Export file
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loading-logo">
            <img src={LOADINGLOGO} />
          </div>
        ) : (
          <div style={style}>
            <AgGridReact
              ref={gridRef}
              rowData={newRowsData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              gridOptions={gridOptions}
              tooltipShowDelay={0}
              tooltipHideDelay={1000}
              paginationPageSize={10}
              components={components}
              getRowStyle={getRowRowStyle}
              enableBrowserTooltips={true}
              suppressMenuHide={true}
              animateRows={true}
              domLayout="autoHeight"
              pagination={true}
              pinnedBottomRowData={pinnedBottomRowData}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PivotTables;
