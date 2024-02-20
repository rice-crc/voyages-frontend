import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import '@/style/time-line-graph.scss';
import { Filter, TimeLineGraphRequest, TimeLineResponse } from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchEstimateTimeLines } from '@/fetch/estimateFetch/fetchEstimateTimeLines';

interface DataItem {
    x: number;
    y0: number;
    y1: number;
}

interface LayerItem {
    x: number;
    y: number;
    embarked: number;
    disembarked: number;
    y1: number;
    y0: number;
}

const datas: DataItem[] = [
    // Your data array here
];

const TimeLineGraphTest: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [disembarkedSlavesta, setDisembarkedSlaves] = useState<number[]>([]);
    const [embarkedSlaves, setEmbarkedSlaves] = useState<number[]>([]);
    const [year, setYear] = useState<number[]>([]);
    const [layers, setLayers] = useState<LayerItem[][]>([]);
    const [yStackMax, setYStackMax] = useState<number>(0);
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);

    const dataSend: TimeLineGraphRequest = {
        filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : []
    };
    const fetchData = async () => {

        try {
            const response = await dispatch(
                fetchEstimateTimeLines(dataSend)
            ).unwrap();

            if (response) {
                console.log({ response })
            }
        } catch (error) {
            console.log('error', error);

        }
    };
    console.log({ disembarkedSlavesta, embarkedSlaves, year })

    useEffect(() => {
        fetchData()
        // Sort the data by year
        const sortedData = datas.sort((a, b) => a.x - b.x);

        // Create an index for quick access to data by year
        const indexByYear: Record<number, number> = {};
        for (let i = 0; i < sortedData.length; ++i) {
            indexByYear[sortedData[i].x] = i;
        }

        // Create layers
        const newLayers = d3.range(2).map((i) =>
            sortedData.map((d) => ({
                x: d.x,
                y: d[`y${i}` as keyof DataItem] as number,
                embarked: d.y1,
                disembarked: d.y0,
                y1: d.y1,
                y0: d.y0,
            }))
        );

        // Find the maximum y value for scaling
        const newYStackMax = d3.max(newLayers, (layer) =>
            d3.max(layer, (d) => d.embarked)
        );

        // Update state
        setLayers([newLayers[1], newLayers[0]]);
        setYStackMax(newYStackMax as any);
        // setData(sortedData);
    }, []);

    const margin = { top: 20, right: 10, bottom: 40, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
        .scaleBand<number>()
        .domain(d3.range(1501, 1867 + 1))
        .rangeRound([0, width]);

    // Rest of your D3 code...

    return (
        <>
            <style
                type="text/css"
                dangerouslySetInnerHTML={{
                    __html:
                        '\n    .g_main {\n        cursor:pointer;\n        pointer-events: all;\n    }\n\n    svg {\n      font-family: "Helvetica Neue", Helvetica;\n    }\n\n    svg text {\n        fill: gray;\n    }\n\n    .axis path,\n    .axis line {\n        fill: none;\n        stroke: gray;\n        stroke-width: 0.35px;\n    }\n\n    .x path {\n        stroke: transparent;\n    }\n\n    .vertical_line {\n        stroke: darkgreen;\n        stroke-width: 1px;\n        stroke-dasharray: 1 1;\n    }\n'
                }}
            />
            <div className="results-panel">
                <div className="tab-title" style={{ marginBottom: "1rem" }}>
                    {"{"}% trans 'Timeline: Number of Captives Embarked and Disembarked per
                    Year' %{"}"}
                </div>
                <div id="graphContainer" />
                <div id="mouseOverInfo" style={{ fontSize: "11pt", margin: 20 }} />
                <div id="historicalEventsContainer" />
                <button
                    className="btn btn-sm btn-outline"
                    type="submit"
                    name="download"
                    value="Download timeline data"
                >
                    {"{"}% trans 'Download Timeline Data' %{"}"}
                </button>
            </div>
        </>

    );
};

export default TimeLineGraphTest;
