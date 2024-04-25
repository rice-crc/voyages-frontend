import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import {
    getMobileMaxHeightTable,
    maxWidthSize,
} from '@/utils/functions/maxWidthSize';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    LabelFilterMeneList,
    RangeSliderState,
    SummaryStatisticsTableRequest,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';
import { Button } from '@mui/material';
import {
    getColorBoxShadow,
    getColorBTNVoyageDatasetBackground,
    getColorHoverBackground,
    getHeaderColomnColor,
} from '@/utils/functions/getColorStyle';
import { fetchSummaryStatisticsTable } from '@/fetch/voyagesFetch/fetchSummaryStatisticsTable';
import { usePageRouter } from '@/hooks/usePageRouter';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { downLoadText } from '@/utils/flatfiles/title_pages';

const SummaryStatisticsTable = () => {
    const dispatch: AppDispatch = useDispatch();

    const [mode, setMode] = useState('html');

    const [summaryData, setSummaryData] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { varName, isChange } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);

    const effectOnce = useRef(false);
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

    const filters = filtersDataSend(filtersObj, styleNameRoute!)

    const dataSend: SummaryStatisticsTableRequest = {
        mode: mode,
        filter:
            Array.isArray(filtersObj[0]?.searchTerm) &&
                filtersObj[0]?.searchTerm.length > 0
                ? filtersObj
                : filters || [],
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (inputSearchValue) {
                dataSend['global_search'] = inputSearchValue;
            }
            try {
                const response = await dispatch(
                    fetchSummaryStatisticsTable(dataSend)
                ).unwrap();
                if (response) {
                    const { data } = response;
                    setSummaryData(data.data);
                    setLoading(false);
                }
            } catch (error) {
                console.log('error', error);
            }
        };
        if (!effectOnce.current) {
            fetchData();
        }
    }, [
        varName,
        inputSearchValue,
        styleNameRoute,
        isChange,
        isChangeGeoTree,
        isChangeAuto,
        autoLabelName,
    ]);

    const percentageString = '96%';
    const [width, height] = useWindowSize();
    const maxWidth = maxWidthSize(width);

    const [style, setStyle] = useState({
        width: percentageString,
        height: 400,
    });

    const containerStyle = useMemo(
        () => ({ width: percentageString, height: height }),
        [maxWidth, height]
    );

    useEffect(() => {
        setStyle({
            width: percentageString,
            height: getMobileMaxHeightTable(height / 1.2),
        });
        const headerColor = getHeaderColomnColor(styleNameRoute!);
        document.documentElement.style.setProperty(
            '--header-color-summary',
            headerColor
        );
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


    let DownloadCSVExport = ''
    for (const header of downLoadText.title) {
        DownloadCSVExport = (header.label as LabelFilterMeneList)[languageValue];
    }


    return (
        <>
            <div className="summary-box">
                <div style={containerStyle} className="ag-theme-alpine">
                    <div style={style} className="summary-box-content">
                        <div className="button-export-csv-summary">
                            <Button
                                onClick={handleButtonExportCSV}
                                style={{
                                    boxShadow: getColorBoxShadow(styleNameRoute!),
                                }}
                                sx={{
                                    backgroundColor: getColorBTNVoyageDatasetBackground(
                                        styleNameRoute!
                                    ),
                                    boxShadow: getColorBoxShadow(styleNameRoute!),
                                    '&:hover': {
                                        backgroundColor: getColorHoverBackground(styleNameRoute!),
                                    },
                                }}
                            >
                                {DownloadCSVExport}
                            </Button>
                        </div>
                        {!summaryData && loading ? (
                            <div className="loading-logo-sumarytable">
                                <img src={LOADINGLOGO} />
                            </div>
                        ) : (
                            <div className="summary-table-container">
                                <div className="summary-table">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: summaryData ?? null }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SummaryStatisticsTable;
