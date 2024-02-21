import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchEstimateTimeLines } from '@/fetch/estimateFetch/fetchEstimateTimeLines';
import { DataTimeLinesItem, EventsTimeLinesType, TimeLineGraphRequest } from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import '@/style/estimates.scss';
import { Disembarked, Embarked } from '@/share/CONST_DATA';

const TimelineChart: React.FC<{ timeline?: Record<string, [number, number]> }> = ({ timeline }) => {
    const dispatch: AppDispatch = useDispatch();
    const [dataTimeLines, setDataTimeLines] = useState<DataTimeLinesItem[]>([])
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const graphContainerRef = useRef<HTMLDivElement | null>(null);
    const mouseOverInfoRef = useRef<HTMLDivElement | null>(null);
    const historicalEventsContainerRef = useRef<HTMLDivElement | null>(null);
    const dataSend: TimeLineGraphRequest = {
        filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : []
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchEstimateTimeLines(dataSend)).unwrap();

                if (response) {
                    console.log({ response });
                    const { data } = response;
                    setDataTimeLines(() => data)

                }
            } catch (error) {
                console.log('error', error);
            }
        };

        fetchData();
    }, [timeline]);
    const dataSort = dataTimeLines.sort((a, b) => a.x - b.x);

    // Clear existing content in graphContainer
    const graphContainer = graphContainerRef.current;
    if (graphContainer) {
        graphContainer.innerHTML = '';
    }
    const indexByYear: { [key: number]: number } = {};
    for (var i = 0; i < dataSort.length; ++i) {
        indexByYear[dataSort[i].x] = i;
    }

    let layers = d3.range(2).map(function (i) {
        return dataSort.map(function (d) {
            return {
                x: d.x,
                y: d['y' + i],
                embarked: d.y1,
                disembarked: d.y0,
                y1: d.y1,
                y0: d.y0
            };
        });
    });

    let yStackMax = d3.max(layers, function (layer) { return d3.max(layer, function (d) { return d.embarked; }); });

    layers = [layers[1], layers[0]];

    const margin = { top: 20, right: 10, bottom: 40, left: 40 }
    const width = 960 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const scaleX: d3.ScaleBand<string> = d3.scaleBand()
        .domain(d3.range(1501, 1867).map(String))
        .rangeRound([0, width]);

    const xShift = scaleX ? -scaleX.bandwidth() * scaleX.domain().indexOf('1501') : 0;

    const yScale = d3.scaleLinear([0, yStackMax! * 1.1], [height, 0]);

    const color = ["#AFEEEE", "#008080", "rgb(30, 98, 127)"];
    const tickSet: number[] = [];
    const firstOrdinal = scaleX.domain()[0];
    const lastOrdinal = scaleX.domain()[scaleX.domain().length - 1];
    let modulus = 10;
    if (lastOrdinal > firstOrdinal + 200) {
        modulus = 50;
    } else if (lastOrdinal > firstOrdinal + 100) {
        modulus = 25;
    } else if (lastOrdinal > firstOrdinal + 50) {
        modulus = 10;
    } else if (lastOrdinal > firstOrdinal + 25) {
        modulus = 5;
    } else {
        modulus = 1;
    }
    let t = Number(firstOrdinal);
    if (Number(firstOrdinal) % modulus) {
        (t) += modulus - (Number(firstOrdinal) % modulus);
    }
    for (; Number(t) <= Number(lastOrdinal); t += modulus) {
        tickSet.push(t);
    }

    var xAxis = d3.axisTop(scaleX)
        .tickValues(tickSet.map(String))
        .tickSize(-height)
        .tickPadding(5);


    const yAxis = d3.axisLeft<number>(yScale)
        .ticks(5)
        .tickFormat(yTickFormat)
        .tickPadding(5)
        .tickSize(-width);


    const svg = d3.select("#graphContainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "g_main")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer")
        .attr("transform", `translate(${xShift}, 0)`)
        .style("fill", (d, i) => color[i]);


    var rect = layer.selectAll("rect")
        .data(function (d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return Number(scaleX(d.x.toString())); })
        .attr("y", height)
        .attr("width", scaleX.bandwidth())
        .attr("height", 0);
    rect.transition()
        .attr("y", function (d) { return yScale(d.y); })
        .attr("height", function (d) { return yScale(0) - yScale(d.y); });

    rect.transition()
        .attr("y", function (d) { return String(yScale(d.y)); }) // Explicitly cast to string
        .attr("height", function (d) { return String(yScale(0) - yScale(d.y)); }); // Explicitly cast to string

    const gx = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + xShift + ", 0)")
        .call(xAxis);

    const gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    const vertical = svg
        .append("g")
        .attr("class", "vertical_highlight")
        .style("opacity", 0.0);

    vertical.append("line")
        .attr("class", "vertical_line")
        .attr("y2", height);
    const circle0 = vertical
        .append("circle")
        .attr("r", 5)
        .style("fill", color[2]);
    const circle1 = vertical
        .append("circle")
        .attr("r", 5)
        .style("fill", color[2]);

    const legend = svg.append("g")
        .attr("class", "legend");


    const legendWidth = 95;
    legend.selectAll('rect')
        .data(layers)
        .enter()
        .append('rect')
        .attr("width", 14)
        .attr("height", 14)
        .attr('y', margin.top + height + 5)
        .attr('x', function (d, i) { return i * legendWidth; })
        .style('fill', function (d, i) { return color[i]; })
        .style('stroke', 'black');



    legend.selectAll('text')
        .data(layers)
        .enter()
        .append('text')
        .attr('y', margin.top + height + 16)
        .attr('x', function (d, i) { return 20 + i * legendWidth; })
        .style('stroke', 'black')
        .style('stroke-width', '0.3')
        .text(function (d, i) { return i != 0 ? Disembarked : Embarked });

    d3.select('.y.axis>.domain').on("mousemove", function () {
        // var mouseX = d3.mouse(this)[0];
        const r = scaleX.range();
        const d = scaleX.domain();
        const dmin = d[0];
        const dmax = d[d.length - 1];
        const rsize = scaleX(dmax)! + xShift - r[0];
        // const year = ~~Math.round((mouseX - r[0]) / rsize * (dmax - dmin)) + dmin;
        // const index = indexByYear[year];
        // changeHoveredBar(index);
    });

    function changeHoveredBar(index: number) {
        var out = index === undefined;
        if (!out) {
            mouseover(dataSort[index]);
            vertical.style("opacity", 1.0);
            vertical.attr("transform", "translate(" + (scaleX.bandwidth() / 2 + Number(scaleX(dataSort[index].x.toString())) + xShift) + ",0)");
            circle0.attr("transform", "translate(0, " + yScale(dataSort[index].y0) + ")");
            circle1.attr("transform", "translate(0, " + yScale(dataSort[index].y1) + ")");
        }
        // if (out && vertical.timeoutfn == null) {
        //     vertical.timeoutfn = function () {
        //         if (vertical.timeoutfn != null) {
        //             vertical.style("opacity", 0.0);
        //             vertical.timeoutfn = null;
        //         }
        //     };
        //     setTimeout(vertical.timeoutfn, 3000);
        // } else if (!out) {
        //     vertical.timeoutfn = null;
        // }
    }

    let events: EventsTimeLinesType | null = null;
    events = {
        '1525': "{% trans 'First slave voyage direct from Africa to the Americas' %}",
        '1560': "{% trans 'Continuous slave trade from Brazil begins' %}",
        '1641': "{% trans 'Sugar exports from Eastern Caribbean begin' %}",
        '1655': "{% trans 'English capture Jamaica' %}",
        '1695': "{% trans 'Gold discovered in Minas Gerais (Brazil)' %}",
        '1697': "{% trans 'French obtain St Domingue in Treaty of Rywsick' %}",
        '1756': "{% trans 'Seven years war begins' %}",
        '1776': "{% trans 'American Revolutionary War begins' %}",
        '1789': "{% trans 'Bourbon reforms open Spanish colonial ports to slaves' %}",
        '1791': "{% trans 'St Domingue revolution begins' %}",
        '1808': "{% trans 'Abolition of British and US slave trades takes effect' %}",
        '1830': "{% trans 'Anglo-Brazilian anti-slave trade treaty' %}",
        '1850': "{% trans 'Brazil suppresses slave trade' %}",
        '1866': "{% trans 'Last reported transatlantic slave voyage arrives in Americas' %}"
    }

    function mouseover(d: any) {
        let historical = '';
        if (events && events[d.x.toString()]) {
            historical = "</div><div class='flex'><strong>{% trans 'Historical event' %}:</strong>" + events[d.x.toString()] + "</div>";
        } else {
            historical = "</div>";
        }

    }


    function yTickFormat(d: any) {
        const formatNumber = d3.format("d");
        if (d >= 2000) {
            return formatNumber(d / 1000) + "k";
        }
        return d;
    }

    return (
        <div className="results-panel">
            <div className="tab-title" style={{ marginBottom: '1rem' }}>
                Timeline: Number of Captives Embarked and Disembarked per Year
            </div>
            <div ref={graphContainerRef} id="graphContainer"></div>
            <div ref={mouseOverInfoRef} id="mouseOverInfo" style={{ fontSize: '11pt', margin: '20px' }}></div>
            <div ref={historicalEventsContainerRef} id="historicalEventsContainer"></div>
            <button className="btn btn-sm btn-outline" type="submit" name="download" value="Download timeline data">
                Download Timeline Data
            </button>
        </div>
    );
};

export default TimelineChart;
