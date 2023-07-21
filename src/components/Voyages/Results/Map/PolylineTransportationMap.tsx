import { PolylineMapProps } from '@/share/InterfaceTypesMap';
import { createNodeDict } from '@/utils/functions/createNodeDict';
import { getMaxEdges, getMinEdges } from '@/utils/functions/getMinMaxEdges';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import * as d3 from 'd3';
import { Polyline } from 'react-leaflet';

const PolylineTransportationMap = (props: PolylineMapProps) => {
  const { transportation, nodesData, pathOptions } = props;
  const minWeightInpixels = 3;
  const maxWeightInPixels = 10;
  const nodeLogValueWeight = d3
    .scaleLog()
    .domain([getMinEdges(transportation), getMaxEdges(transportation)])
    .range([minWeightInpixels, maxWeightInPixels]);

  const polylineTransportation = transportation.map((edge) => {
    const nodesDict = createNodeDict(nodesData);
    const source = nodesDict[edge.s];
    const target = nodesDict[edge.t];
    const size = getEdgesSize(edge);
    let weight = 0;
    if (size !== null) {
      weight = nodeLogValueWeight(size);
    }

    if (source && target && weight) {
      const polyline = [source, target];
      return (
        <div key={`${edge.s}-${edge.t}-${edge.w}`}>
          <Polyline
            pathOptions={pathOptions}
            positions={polyline}
            weight={weight}
            stroke={true}
            lineCap={'round'}
          />
        </div>
      );
    }
  });
  return polylineTransportation;
};

export default PolylineTransportationMap;
