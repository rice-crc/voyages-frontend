
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { summaryStatisticsData } from './mockData/summaryStatistics';
import { getRowHeightTable } from '@/utils/functions/getRowHeightTable';
import { useWindowSize } from '@react-hook/window-size';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';
import CustomSummaryHeader from '@/components/NavigationComponents/Header/CustomSummaryHeader';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
const SummaryStatisticsTableEmpty = () => {

    const [rowData, setRowData] = useState<any[]>([]);
    const gridRef = useRef<any>(null);

    useEffect(() => {
        const formattedData = summaryStatisticsData.data.map((item) => ({
            label: item[0],
            value1: item[1].toLocaleString(),
            value2: item[2].toLocaleString(),
            value3: item[3].toLocaleString(),
            value4: item[4].toLocaleString(),
            value5: item[5].toLocaleString(),
        }));
        setRowData(formattedData);
    }, []);


    const [columnDefs] = useState<any[]>([
        { headerName: '', field: 'label', minWidth: 500 },
        { headerName: 'Total captives', field: 'value1', minWidth: 200 },
        { headerName: 'Total voyages with this datapoint', field: 'value2', minWidth: 300 },
        { headerName: 'Average', field: 'value3', minWidth: 200 },
        { headerName: 'Median', field: 'value4', minWidth: 200 },
        { headerName: 'Standard deviation', field: 'value5', minWidth: 200 },
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
        width: percentageString,
        padding: '0 40px'
    });

    const containerStyle = useMemo(
        () => ({ width: percentageString, height: height }),
        [maxWidth, height]
    );


    useEffect(() => {
        setStyle({
            width: percentageString,
            padding: '0 40px'
        });
    }, [width, height, maxWidth]);

    const getRowRowStyle = useCallback(
        () => ({
            fontSize: 14,
            fontWeight: 500,
            color: '#000',
            fontFamily: 'sans-serif',
            paddingLeft: '10%',
            borderLeft: '0.25px solid gray',
        }),
        []
    );
    const components = useMemo(
        () => ({
            agColumnHeader: CustomSummaryHeader,
        }),
        []
    );

    return (
        <>

            <div style={containerStyle} className="ag-theme-alpine" >
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
            {/* </div> */}
        </>

    );
};

export default SummaryStatisticsTableEmpty;
