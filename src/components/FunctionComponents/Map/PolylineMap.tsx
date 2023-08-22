import { RootState } from '@/redux/store';
import { PolylineMapProps, Transportation } from '@/share/InterfaceTypesMap';
import { createNodeDict } from '@/utils/functions/createNodeDict';
import { getMaxEdges, getMinEdges } from '@/utils/functions/getMinMaxEdges';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import * as d3 from 'd3';
import { Polyline } from 'react-leaflet';
import { useSelector } from 'react-redux';

const PolylineMap = () => {
  const { nodesData, transportation, disposition, origination } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );
  const minWeightInpixels = 3;
  const maxWeightInPixels = 10;
  const nodeLogValueWeight = d3
    .scaleLog()
    .domain([getMinEdges(transportation), getMaxEdges(transportation)])
    .range([minWeightInpixels, maxWeightInPixels]);

  const renderPolyline = (edge: Transportation, type: string) => {
    const nodesDict = createNodeDict(nodesData);
    const source = nodesDict[edge?.s || 0.15];
    const target = nodesDict[edge?.t || 0.2];

    const size = getEdgesSize(edge);
    let weight = 0;
    if (size !== null) {
      weight = nodeLogValueWeight(size);
    }

    if (source && target && weight) {
      const polyline = [source, target];
      const typeColor =
        type === 'transportation'
          ? 'rgb(215, 153, 250)'
          : type === 'disposition'
          ? 'rgb(246,193,60)'
          : 'rgb(96, 192, 171)';
      const polylinePathOptions = { color: typeColor };

      return (
        <div key={`${edge.s}-${edge.t}-${edge.w}`}>
          <Polyline
            pathOptions={polylinePathOptions}
            positions={polyline}
            weight={weight}
            stroke={true}
            lineCap={'round'}
          />
        </div>
      );
    }

    return null;
  };

  const polylineTransportation = transportation.map((edge) => {
    return renderPolyline(edge, 'transportation');
  });
  const polylineDisposition = disposition?.map((edge) =>
    renderPolyline(edge, 'disposition')
  );
  const polylineOrigination = origination?.map((edge) =>
    renderPolyline(edge, 'origination')
  );

  return (
    <>
      {polylineTransportation}
      {polylineDisposition}
      {polylineOrigination}
    </>
  );
};

export default PolylineMap;
