import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchEstimateTimeLines } from '@/fetch/estimateFetch/fetchEstimateTimeLines';
import { TimeLineGraphRequest } from '@/share/InterfaceTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import '@/style/estimates.scss';
interface DataItem {
    x: number;
    y0: number;
    y1: number;
    [key: string]: number;
}

interface LayerItem {
    x: number;
    y: number;
    embarked: number;
    disembarked: number;
    y1: number;
    y0: number;
}

const Disembarked = 'Disembarked '
const Embarked = "Embarked "
const TimelineChart: React.FC<{ timeline: Record<string, [number, number]> }> = ({ timeline }) => {
    const dispatch: AppDispatch = useDispatch();
    const [disembarkedSlavesta, setDisembarkedSlaves] = useState<number[]>([]);
    const [embarkedSlaves, setEmbarkedSlaves] = useState<number[]>([]);
    const [year, setYear] = useState<number[]>([]);
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const graphContainerRef = useRef<HTMLDivElement | null>(null);
    const mouseOverInfoRef = useRef<HTMLDivElement | null>(null);
    const historicalEventsContainerRef = useRef<HTMLDivElement | null>(null);
    const dataSend: TimeLineGraphRequest = {
        filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : []
    };
    const data: DataItem[] = JSON.parse('[{"x": 1775, "y0": 79008, "y1": 92908}, {"x": 1776, "y0": 77748, "y1": 87147}, {"x": 1777, "y0": 60250, "y1": 66846}, {"x": 1778, "y0": 54928, "y1": 60828}, {"x": 1779, "y0": 34166, "y1": 37761}, {"x": 1780, "y0": 36718, "y1": 39693}, {"x": 1781, "y0": 44126, "y1": 48479}, {"x": 1782, "y0": 47303, "y1": 52401}, {"x": 1783, "y0": 55936, "y1": 62264}, {"x": 1784, "y0": 94384, "y1": 104364}, {"x": 1785, "y0": 84179, "y1": 95151}, {"x": 1786, "y0": 83202, "y1": 95531}, {"x": 1787, "y0": 88240, "y1": 101306}, {"x": 1788, "y0": 91269, "y1": 104037}, {"x": 1789, "y0": 81057, "y1": 92415}, {"x": 1790, "y0": 98139, "y1": 112051}, {"x": 1791, "y0": 94877, "y1": 107582}, {"x": 1792, "y0": 101948, "y1": 115518}, {"x": 1793, "y0": 89622, "y1": 99562}, {"x": 1794, "y0": 61547, "y1": 67468}, {"x": 1795, "y0": 64343, "y1": 69235}, {"x": 1796, "y0": 61839, "y1": 68233}, {"x": 1797, "y0": 67946, "y1": 75155}, {"x": 1798, "y0": 65551, "y1": 71269}, {"x": 1799, "y0": 79804, "y1": 88089}, {"x": 1800, "y0": 77528, "y1": 86302}, {"x": 1801, "y0": 71371, "y1": 79218}, {"x": 1802, "y0": 88812, "y1": 98944}, {"x": 1803, "y0": 86954, "y1": 97720}, {"x": 1804, "y0": 77893, "y1": 88678}, {"x": 1805, "y0": 79074, "y1": 89347}, {"x": 1806, "y0": 89345, "y1": 102161}, {"x": 1807, "y0": 97036, "y1": 112577}, {"x": 1808, "y0": 37556, "y1": 42842}, {"x": 1809, "y0": 35329, "y1": 39937}, {"x": 1810, "y0": 64105, "y1": 72129}, {"x": 1811, "y0": 52200, "y1": 57954}, {"x": 1812, "y0": 54055, "y1": 60477}, {"x": 1813, "y0": 45862, "y1": 50698}, {"x": 1814, "y0": 49136, "y1": 53934}, {"x": 1815, "y0": 53390, "y1": 59666}, {"x": 1816, "y0": 69650, "y1": 76844}, {"x": 1817, "y0": 80059, "y1": 88751}, {"x": 1818, "y0": 78509, "y1": 87433}, {"x": 1819, "y0": 68047, "y1": 76483}, {"x": 1820, "y0": 63786, "y1": 73607}]')
    const dataSort = data.sort((a, b) => a.x - b.x);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchEstimateTimeLines(dataSend)).unwrap();

                if (response) {
                    console.log({ response });
                    const { data } = response;
                    setDisembarkedSlaves(data.disembarked_slaves);
                    setEmbarkedSlaves(data.embarked_slaves);
                    setYear(data.year);

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
                            mouseover(data[index]);
                            vertical.style("opacity", 1.0);
                            vertical.attr("transform", "translate(" + (scaleX.bandwidth() / 2 + Number(scaleX(data[index].x.toString())) + xShift) + ",0)");
                            circle0.attr("transform", "translate(0, " + yScale(data[index].y0) + ")");
                            circle1.attr("transform", "translate(0, " + yScale(data[index].y1) + ")");
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
                    function mouseover(d: any) {
                        var historical = '';
                        // if (events && events[d.x.toString()]) {
                        //     historical = "</div><div class='flex'><strong>{% trans 'Historical event' %}:</strong>" + events[d.x.toString()] + "</div>";
                        // } else {
                        //     historical = "</div>";
                        // }

                    }
                    let events = null;

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
                    };


                    function yTickFormat(d: any) {
                        const formatNumber = d3.format("d");
                        if (d >= 2000) {
                            return formatNumber(d / 1000) + "k";
                        }
                        return d;
                    }
                }
            } catch (error) {
                console.log('error', error);
            }
        };

        fetchData();
    }, [timeline]);

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
