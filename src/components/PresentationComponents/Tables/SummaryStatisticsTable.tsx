
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { summaryStatisticsData } from './mockData/summaryStatistics';
import { getRowHeightTable } from '@/utils/functions/getRowHeightTable';
import { useWindowSize } from '@react-hook/window-size';
import { getMobileMaxHeightTable, getMobileMaxWidth, maxWidthSize } from '@/utils/functions/maxWidthSize';
import CustomSummaryHeader from '@/components/NavigationComponents/Header/CustomSummaryHeader';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const SummaryStatisticsTable = () => {

    const [rowData, setRowData] = useState<any[]>([]);
    const gridRef = useRef<any>(null);

    useEffect(() => {
        const formattedData = summaryStatisticsData.data.map((item) => ({
            label: item[0],
            value1: item[1].toLocaleString(),
            value2: item[2].toLocaleString(),
            value3: item[3].toLocaleString(),
            value4: item[4].toLocaleString(),
        }));
        setRowData(formattedData);
    }, []);


    const [columnDefs] = useState<any[]>([
        { headerName: 'Summary Details', field: 'label', sorting: true, sort: 'desc', width: 450 },
        { headerName: 'Total captives', field: 'value1', sorting: true, sort: 'desc', width: 180 },
        { headerName: 'Total voyages', field: 'value2', sorting: true, sort: 'desc', width: 180 },
        { headerName: 'Average', field: 'value3', sorting: true, sort: 'desc', width: 180 },
        { headerName: 'Standard deviation', field: 'value4', sorting: true, sort: 'desc', width: 200 },
    ]);

    const defaultColDef = useMemo(() => {
        return {
            width: 200,
        };
    }, []);


    const gridOptions = useMemo(
        () => ({
            headerHeight: 40,
            suppressHorizontalScroll: true,
            onGridReady: (params: any) => {
                const { columnApi } = params;
                columnApi.autoSizeColumns();
            },
        }),
        []
    );
    const percentageString = '100%'
    const [width, height] = useWindowSize();
    const maxWidth = maxWidthSize(width);
    const [style, setStyle] = useState({
        width: parseFloat(percentageString) / 100,
        height: 300,
    });

    const containerStyle = useMemo(
        () => ({ width: maxWidth, height: height }),
        [maxWidth, height]
    );

    useEffect(() => {
        setStyle({
            width: getMobileMaxWidth(maxWidth),
            height: getMobileMaxHeightTable(height / 2),
        });
    }, [width, height, maxWidth]);

    const getRowRowStyle = useCallback(
        () => ({
            fontSize: 14,
            fontWeight: 500,
            color: '#000',
            fontFamily: 'Arial,sans-serif',
            paddingLeft: '10%',
        }),
        []
    );
    const components = useMemo(
        () => ({
            agColumnHeader: CustomSummaryHeader,
        }),
        []
    );

    const handleButtonExportCSV = useCallback(() => {
        (gridRef.current as AgGridReact<any>).api.exportDataAsCsv();
    }, []);

    return (
        <>
            <HeaderLogoSearch />
            <div className='summary-box'>
                <div className="button-export-csv-summary">
                    <button onClick={handleButtonExportCSV}>
                        Download CSV Export file
                    </button>
                </div>
                <div style={containerStyle} className="ag-theme-alpine" >
                    <div style={style}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            gridOptions={gridOptions}
                            getRowHeight={getRowHeightTable}
                            columnDefs={columnDefs}
                            suppressMenuHide={true}
                            animateRows={true}
                            defaultColDef={defaultColDef}
                            components={components}
                            getRowStyle={getRowRowStyle}
                            enableBrowserTooltips={true}
                            tooltipShowDelay={0}
                            tooltipHideDelay={1000}
                        />
                    </div>
                </div>
            </div>
        </>

    );
};

export default SummaryStatisticsTable;
