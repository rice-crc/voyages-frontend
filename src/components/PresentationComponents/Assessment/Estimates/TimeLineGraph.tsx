/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from 'antd';
import * as d3 from 'd3';
import { select } from 'd3-selection';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchEstimateTimeLines } from '@/fetch/estimateFetch/fetchEstimateTimeLines';
import { usePageRouter } from '@/hooks/usePageRouter';
import { AppDispatch, RootState } from '@/redux/store';
import { Disembarked, Embarked } from '@/share/CONST_DATA';
import {
  DataTimeLinesItem,
  ElementTimeLine,
  EventsTimeLinesType,
  FilterObjectsState,
  TimeLineGraphRequest,
} from '@/share/InterfaceTypes';
import '@/style/estimates.scss';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';

const TimelineChart: React.FC<{
  timeline?: Record<string, [number, number]>;
}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [dataSort, setDataSort] = useState<DataTimeLinesItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { currentBlockName, styleName } = usePageRouter();
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  
  const graphContainerRef = useRef<HTMLDivElement | null>(null);
  const mouseOverInfoRef = useRef<HTMLDivElement | null>(null);
  const historicalEventsContainerRef = useRef<HTMLDivElement | null>(null);

  const filters = useMemo(
    () =>
      filtersDataSend(
        filtersObj,
        styleName!,
      ),
    [filtersObj, styleName]
  );

   const newFilters = useMemo(() => {
     return filters?.filter(f => !f.varName || f.varName !== "dataset") || [];
   }, [filters]);

  const dataSend: TimeLineGraphRequest = useMemo(() => {
    return {
      filter: newFilters || [],
    };
  }, [newFilters]);

  const {
    currentSliderValue,
    changeFlag,
    checkedListEmbarkation,
    checkedListDisEmbarkation,
  } = useSelector((state: RootState) => state.getEstimateAssessment);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dispatch(
          fetchEstimateTimeLines(dataSend),
        ).unwrap();
        if (response) {
          const { data } = response;
          setDataSort(data.sort((a: any, b: any) => a.x - b.x));
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentBlockName === 'timeline') {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    varName,
    currentSliderValue,
    changeFlag,
    checkedListEmbarkation,
    checkedListDisEmbarkation,
    currentBlockName
  ]);

  useEffect(() => {
    const graphContainer = graphContainerRef.current;

    if (graphContainer && dataSort.length > 0) {
      graphContainer.innerHTML = ''; // Clear existing content in graphContainer

      const indexByYear: { [key: number]: number } = {};
      for (let i = 0; i < dataSort.length; ++i) {
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
            y0: d.y0,
          };
        });
      });
      // setLoading(false);
      const yStackMax = d3.max(layers, function (layer) {
        return d3.max(layer, function (d) {
          return d.embarked;
        });
      });

      layers = [layers[1], layers[0]];

      const margin = { top: 20, right: 10, bottom: 40, left: 40 };
      const width = 960 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      if (mouseOverInfoRef.current) {
        mouseOverInfoRef.current.style.marginLeft = margin.left + 'px';
      }

      const scaleX: d3.ScaleBand<number> = d3
        .scaleBand<number>()
        .domain(d3.range(1501, 1867))
        .rangeRound([0, width]);

      const xShift = scaleX
        ? -scaleX.bandwidth() * scaleX.domain().indexOf(1501)
        : 0;

      const yScale = d3.scaleLinear([0, yStackMax! * 1.1], [height, 0]);

      // const color = ["#AFEEEE", "#008080", "rgb(30, 98, 127)"]; // Original one
      const color = ['#42a5f5a3', 'rgb(25, 118, 210)', 'rgb(2 72 141)']; // Maybe change too
      const tickSet: number[] = [];
      let firstOrdinal = scaleX.domain()[0];
      let lastOrdinal = scaleX.domain()[scaleX.domain().length - 1];

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
        t += modulus - (Number(firstOrdinal) % modulus);
      }
      for (; Number(t) <= Number(lastOrdinal); t += modulus) {
        tickSet.push(t);
      }

      const xAxis = d3
        .axisTop(scaleX)
        .tickValues(tickSet)
        .tickSize(-height)
        .tickPadding(5);

      const yAxis = d3
        .axisLeft<number>(yScale)
        .ticks(5)
        .tickFormat(yTickFormat)
        .tickPadding(5)
        .tickSize(-width);

      const svg = d3
        .select('#graphContainer')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'g_main')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const layer = svg
        .selectAll('.layer')
        .data(layers)
        .enter()
        .append('g')
        .attr('class', 'layer')
        .attr('transform', `translate(${xShift}, 0)`)
        .style('fill', (d, i) => color[i]);

      function mouseover(d: any) {
        let historical = '';
        if (events && events[d.x.toString()]) {
          historical = `</div><div class='flex'><strong>Historical event:</strong>${
            events[d.x.toString()]
          }</div>`;
        } else {
          historical = '</div>';
        }

        if (mouseOverInfoRef.current) {
          mouseOverInfoRef.current.innerHTML = `<div class='flex'><strong>Year:</strong> ${
            d.x
          }</div><div class='flex'><strong >Embarked:</strong> ${Math.round(
            d.y1,
          ).toString()}</div><div class='flex'><strong>Disembarked:</strong> ${Math.round(
            d.y0,
          ).toString()}${historical}`;
        }
      }

      const rect = layer
        .selectAll('rect')
        .data(function (d) {
          return d;
        })
        .enter()
        .append('rect')
        .attr('x', function (d) {
          return Number(scaleX(d.x));
        })
        .attr('y', height)
        .attr('width', scaleX.bandwidth())
        .attr('height', 0)
        .transition()
        .attr('y', function (d) {
          return yScale(d.y);
        })
        .attr('height', function (d) {
          return yScale(0) - yScale(d.y);
        });
      rect.remove();

      rect
        .transition()
        .attr('y', function (d) {
          return yScale(d.y);
        })
        .attr('height', function (d) {
          return yScale(0) - yScale(d.y);
        });

      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + xShift + ', 0)')
        .call(xAxis);

      svg.append('g').attr('class', 'y axis').call(yAxis);

      svg.exit().remove();

      const vertical = svg
        .append('g')
        .attr('class', 'vertical_highlight')
        .style('opacity', 0.0);

      vertical.append('line').attr('class', 'vertical_line').attr('y2', height);

      const circle0 = vertical
        .append('circle')
        .attr('r', 5)
        .style('fill', color[2]);

      const circle1 = vertical
        .append('circle')
        .attr('r', 5)
        .style('fill', color[2]);

      const legend = svg.append('g').attr('class', 'legend');

      const legendWidth = 95;
      legend
        .selectAll('rect')
        .data(layers)
        .enter()
        .append('rect')
        .attr('width', 14)
        .attr('height', 14)
        .attr('y', margin.top + height + 5)
        .attr('x', function (d, i) {
          return i * legendWidth;
        })
        .style('fill', function (d, i) {
          return color[i];
        })
        .style('stroke', 'black');

      legend
        .selectAll('text')
        .data(layers)
        .enter()
        .append('text')
        .attr('y', margin.top + height + 16)
        .attr('x', function (d, i) {
          return 20 + i * legendWidth;
        })
        .style('stroke', 'black')
        .style('stroke-width', '0.3')
        .text(function (d, i) {
          return i != 0 ? Disembarked : Embarked;
        })
        .classed('svg-timeline-text', true);

      if (graphContainer) {
        graphContainer.addEventListener('mousemove', (event) => {
          const mouseX: number = event.offsetX || event.layerX;
          const r: [number, number] = scaleX.range();
          const d: number[] = scaleX.domain();
          const dmin: number = d[0];
          const dmax: number = d[d.length - 1];
          const rsize: number = scaleX(dmax)! + xShift - r[0];
          const year: number =
            ~~Math.round(((mouseX - r[0]) / rsize) * (dmax - dmin)) + dmin;
          const index: number | undefined = indexByYear[year];
          if (index !== undefined) {
            changeHoveredBar(index);
          }
        });
      }

      function changeHoveredBar(index: number) {
        const out = index === undefined;
        if (!out) {
          mouseover(dataSort[index]);
          vertical.style('opacity', 1.0);
          vertical.attr(
            'transform',
            'translate(' +
              (scaleX.bandwidth() / 2 +
                Number(scaleX(dataSort[index].x)) +
                xShift) +
              ',0)',
          );
          circle0.attr(
            'transform',
            'translate(0, ' + yScale(dataSort[index].y0) + ')',
          );
          circle1.attr(
            'transform',
            'translate(0, ' + yScale(dataSort[index].y1) + ')',
          );
        }
        if (out && (vertical as any).timeoutfn == null) {
          (vertical as any).timeoutfn = function () {
            if ((vertical as any).timeoutfn != null) {
              vertical.style('opacity', 0.0);
              (vertical as any).timeoutfn = null;
            }
          };
          setTimeout((vertical as any).timeoutfn, 3000);
        } else if (!out) {
          (vertical as any).timeoutfn = null;
        }
      }

      let events: EventsTimeLinesType | null = null;
      events = {
        '1525': 'First slave voyage direct from Africa to the Americas',
        '1560': 'Continuous slave trade from Brazil begins',
        '1641': 'Sugar exports from Eastern Caribbean begin',
        '1655': 'English capture Jamaica',
        '1695': 'Gold discovered in Minas Gerais (Brazil)',
        '1697': 'French obtain St Domingue in Treaty of Rywsick',
        '1756': 'Seven years war begins',
        '1776': 'American Revolutionary War begins',
        '1789': 'Bourbon reforms open Spanish colonial ports to slaves',
        '1791': 'St Domingue revolution begins',
        '1808': 'Abolition of British and US slave trades takes effect',
        '1830': 'Anglo-Brazilian anti-slave trade treaty',
        '1850': 'Brazil suppresses slave trade',
        '1866': 'Last reported transatlantic slave voyage arrives in Americas',
      };
      firstOrdinal = scaleX.domain()[0];
      lastOrdinal = scaleX.domain()[scaleX.domain().length - 1];

      const filteredEvents = [];
      const allEvents = [];

      for (const year in events) {
        const text = events[year];
        const newYear = parseInt(year) as number;
        let data_index = -1;
        const included =
          parseInt(year) >= firstOrdinal && parseInt(year) <= lastOrdinal;
        if (included) {
          for (let i = 0; i < dataSort.length; ++i) {
            if (dataSort[i].x == newYear) {
              data_index = i;
              break;
            }
          }
        }
        const element: ElementTimeLine = {
          counter: 1 + allEvents.length,
          year: year,
          label: text,
          index: data_index,
        };
        allEvents.push(element);
        if (included) {
          filteredEvents.push(element);
        }
      }

      const boxSize = 19;

      const historicalMarkers = svg.append('g').attr('class', 'event');
      const historicalMarkersGroup = historicalMarkers
        .selectAll<SVGGElement, { year: number }>('g')
        .data(filteredEvents)
        .enter()
        .append('g');
      historicalMarkersGroup
        .append('rect')
        .attr('width', boxSize)
        .attr('height', boxSize)
        .attr('y', margin.top + height - boxSize - 1)
        .attr('x', function (d) {
          return (
            scaleX(parseInt(d.year))! +
            xShift -
            (boxSize - scaleX.bandwidth()) / 2
          );
        })
        .style('fill', color[2])
        .style('stroke', 'black');

      historicalMarkersGroup
        .append('text')
        .attr('width', boxSize)
        .attr('text-anchor', 'middle')
        .attr('y', margin.top + height - boxSize / 2)
        .attr('x', function (d: ElementTimeLine) {
          return scaleX(parseInt(d.year))! + xShift + scaleX.bandwidth() / 2;
        })
        .attr('dominant-baseline', 'central')
        .text((d: any) => d.counter)
        .style('cursor', 'default')
        .style('font-size', '10pt')
        .style('fill', 'white');

      historicalMarkers
        .selectAll<SVGGElement, ElementTimeLine>('g')
        .on('mousemove', function (event: MouseEvent, d: ElementTimeLine) {
          const highlightColor = '#CA4223';
          select(this).selectAll('rect').style('fill', highlightColor);
          colorHistoricalEvent(d, highlightColor);
          if (d.index >= 0) {
            changeHoveredBar(d.index);
          } else {
            vertical.style('opacity', 0.0);
            mouseover({ x: d.year, y1: 0, y0: 0 });
          }
          event.stopPropagation();
        })
        .on('mouseout', function (event: MouseEvent, d: ElementTimeLine) {
          select(this).selectAll('rect').style('fill', color[2]);
          colorHistoricalEvent(d, color[2]);
        });

      function colorHistoricalEvent(d: ElementTimeLine, color: string): void {
        const ev = historicalEvents
          .selectAll<SVGGElement, ElementTimeLine>('g')
          .filter(function (d2: ElementTimeLine) {
            return d2.year == d.year;
          });

        ev.selectAll('rect').style('fill', color);
      }
      // List ALL historical events in another D3 graph.
      const svgHistorical = d3
        .select('#historicalEventsContainer')
        .html('')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height - 110)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',0)');
      const historicalEvents = svgHistorical.append('g').attr('class', 'event');
      historicalEvents.selectAll('g').data(allEvents).enter().append('g');
      const columnLength: number = Math.ceil(allEvents.length / 2);
      const xCoord = (d: { counter: number }) =>
        Math.floor((d.counter - 1) / columnLength) * 390;
      const yCoord = (d: { counter: number }) =>
        margin.top / 3 + ((d.counter - 1) % columnLength) * 25;

      historicalEvents
        .selectAll<SVGGElement, { counter: number }>('g')
        .append('rect')
        .attr('width', boxSize)
        .attr('height', boxSize)
        .attr('y', yCoord)
        .attr('x', xCoord)
        .style('fill', color[2])
        .style('stroke', 'black');
      historicalEvents
        .selectAll<
          SVGGElement,
          { counter: number; year: number; label: string }
        >('g')
        .append('text')
        .attr('width', boxSize)
        .attr('text-anchor', 'middle')
        .attr('y', (d) => yCoord(d) + 1 + boxSize / 2)
        .attr('x', (d) => xCoord(d) + boxSize / 2)
        .attr('dominant-baseline', 'central')
        .text((d) => d.counter)
        .style('cursor', 'default')
        .style('font-size', '10pt')
        .style('fill', 'white');

      historicalEvents
        .selectAll<
          SVGGElement,
          { counter: number; year: number; label: string }
        >('g')
        .append('text')
        .attr('width', boxSize)
        .attr('text-anchor', 'middle')
        .attr('y', (d) => yCoord(d) + 1 + boxSize / 2)
        .attr('x', (d) => xCoord(d) + 2.3 * boxSize)
        .attr('dominant-baseline', 'central')
        .text((d) => d.year)
        .style('cursor', 'default')
        .style('font-size', '10pt')
        .style('font-weight', 'bold')
        .style('fill', 'black');

      historicalEvents
        .selectAll<
          SVGGElement,
          { counter: number; year: number; label: string }
        >('g')
        .append('text')
        .attr('width', boxSize)
        .attr('y', (d) => yCoord(d) + 1 + boxSize / 2)
        .attr('x', (d) => xCoord(d) + 3.5 * boxSize)
        .attr('dominant-baseline', 'central')
        .text((d) => d.label)
        .style('cursor', 'default')
        .style('font-size', '9pt')
        .style('fill', 'black');
    }
  }, [dataSort]);

  function yTickFormat(d: any) {
    const formatNumber = d3.format('d');
    if (d >= 2000) {
      return formatNumber(d / 1000) + 'k';
    }
    return d;
  }

  const exportToExcel = () => {
    const dataToExport = dataSort.map((item) => [item.x, item.y1, item.y0]);
    const ws = XLSX.utils.aoa_to_sheet([
      ['Year', 'Embarked Slaves', 'Disembarked Slaves'],
      ...dataToExport,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'timeline_data.xlsx');
  };

  return (
    <>
      <div className="results-panel">
        {loading ? (
          <div className="loading-logo-graph">
            <img src={LOADINGLOGO} alt="loading" />
          </div>
        ) : (
          <>
            <div
              className="tab-title-timeline"
              style={{ marginBottom: '1rem' }}
            >
              Timeline: Number of Captives Embarked and Disembarked per Year
            </div>
            <div ref={graphContainerRef} id="graphContainer"></div>
            <div
              ref={mouseOverInfoRef}
              id="mouseOverInfo"
              style={{ fontSize: '11pt', margin: '20px' }}
            ></div>
            <div
              ref={historicalEventsContainerRef}
              id="historicalEventsContainer"
            ></div>
            <div className="reset-btn-estimate">
              <Button
                className="deselec-btn"
                name="download"
                onClick={exportToExcel}
                value="Download timeline data"
              >
                {' '}
                Download Timeline Data
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TimelineChart;
