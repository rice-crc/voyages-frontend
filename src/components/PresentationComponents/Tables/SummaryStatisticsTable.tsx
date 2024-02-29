import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useWindowSize } from '@react-hook/window-size';
import {
    getMobileMaxHeightTable,
    maxWidthSize,
} from '@/utils/functions/maxWidthSize';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    CurrentPageInitialState,
    Filter,
    RangeSliderState,
    SummaryStatisticsTableRequest,
} from '@/share/InterfaceTypes';
import { fetchSummaryStatisticsTable } from '@/fetch/voyagesFetch/fetchSummaryStatisticsTable';
import '@/style/table.scss';
import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { Button } from '@mui/material';
import { getColorBoxShadow, getColorBTNVoyageDatasetBackground, getColorHoverBackground, getHeaderColomnColor } from '@/utils/functions/getColorStyle';
import { usePageRouter } from '@/hooks/usePageRouter';
import { formatNumberWithCommasOrPercentage } from '@/utils/functions/formatNumberWithCommas';

const SummaryStatisticsTable = () => {
    const dispatch: AppDispatch = useDispatch();

    const [mode, setMode] = useState('html');
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const [data, setData] = useState<string>('');
    const { varName, isChange } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { styleName: styleNameRoute } = usePageRouter();
    const { isChangeAuto, autoLabelName } = useSelector(
        (state: RootState) => state.autoCompleteList
    );
    const { inputSearchValue } = useSelector(
        (state: RootState) => state.getCommonGlobalSearch
    );
    const { isChangeGeoTree } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );

    const { currentPage } = useSelector(
        (state: RootState) => state.getScrollPage as CurrentPageInitialState
    );


    const { styleName } = useSelector(
        (state: RootState) => state.getDataSetCollection
    );
    let filters: Filter[] = [];
    if (styleNameRoute === 'trans-atlantic') {
        if (filtersObj[0]?.searchTerm?.length > 0) {
            filters = filtersObj
        } else {
            filters.push({
                varName: "dataset",
                searchTerm: [0],
                op: "in"
            });
        }
    } else {
        filters = filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : [];
    }

    const dataSend: SummaryStatisticsTableRequest = {
        mode: mode,
        filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : filters,
    };



    useEffect(() => {
        const fetchData = async () => {
            if (inputSearchValue) {
                dataSend['global_search'] = inputSearchValue
            }
            try {
                const response = await dispatch(
                    fetchSummaryStatisticsTable(dataSend)
                ).unwrap();
                if (response) {
                    const { data } = response;
                    setData(data.data);
                }
            } catch (error) {
                console.log('error', error);
            }
        };

        fetchData();
    }, [
        varName,
        inputSearchValue,
        styleName,
        isChange,
        isChangeGeoTree,
        isChangeAuto,
        autoLabelName,
    ]);

    const percentageString = '95%';
    const [width, height] = useWindowSize();
    const maxWidth = maxWidthSize(width);

    const [style, setStyle] = useState({
        width: percentageString,
        height: 400,
        padding: '0 40px',
    });

    const containerStyle = useMemo(
        () => ({ width: percentageString, height: height }),
        [maxWidth, height]
    );

    useEffect(() => {
        setStyle({
            width: percentageString,
            height: getMobileMaxHeightTable(height / 1.2),
            padding: '0 40px',
        });
    }, [width, height, maxWidth]);

    const handleButtonExportCSV = useCallback(() => {
        const table = document.querySelector('.summary-table');

        if (!table) {
            console.error('Table element not found');
            return;
        }

        const rows = Array.from(table.querySelectorAll('tr'));
        const csvContent = rows
            .map((row) =>
                Array.from(row.children)
                    .map((cell) => cell.textContent)
                    .join(',')
            )
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'summarystats_table_data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setMode('csv');
    }, [mode]);

    useEffect(() => {
        const headerColor = getHeaderColomnColor(styleName!);
        document.documentElement.style.setProperty('--header-color-summary', headerColor);
    }, []);


    return (
        <>
            <HeaderLogoSearch />
            <div className="summary-box">
                <div style={containerStyle} className="ag-theme-alpine">
                    <div style={style}>
                        <div className="button-export-csv-summary">
                            <Button onClick={handleButtonExportCSV}
                                style={{

                                    boxShadow: getColorBoxShadow(styleName!)
                                }}
                                sx={{
                                    backgroundColor: getColorBTNVoyageDatasetBackground(styleName!),
                                    boxShadow: getColorBoxShadow(styleName!),
                                    '&:hover': {
                                        backgroundColor: getColorHoverBackground(styleName!),
                                    },
                                }}
                            >
                                Download CSV Export file
                            </Button>
                        </div>
                        <div className="summary-table-container">
                            <div className="summary-table">
                                {/* <div dangerouslySetInnerHTML={{ __html: formatNumberWithCommasOrPercentage(data) ?? null }} /> */}
                                <div dangerouslySetInnerHTML={{ __html: data ?? null }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default SummaryStatisticsTable;
