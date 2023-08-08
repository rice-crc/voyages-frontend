import { NodeMarkerMapProps } from '@/share/InterfaceTypesMap';
import {
  getMaxValueNode,
  getMinValueNode,
} from '@/utils/functions/getMinMaxValueNode';
import { getNodeColorMapVoyagesStyle } from '@/utils/functions/getNodeColorStyle';
import { getNodeSize } from '@/utils/functions/getNodeSize';
import { CircleMarker, Popup } from 'react-leaflet';
import * as d3 from 'd3';

const NodeMarkerMap = ({ nodesData }: NodeMarkerMapProps) => {
  const minRadiusInpixels = 3;
  const maxRadiusInPixels = 25;
  const nodeLogValueScale = d3
    .scaleLog()
    .domain([getMinValueNode(nodesData), getMaxValueNode(nodesData)])
    .range([minRadiusInpixels, maxRadiusInPixels]);

  const nodeMarker = nodesData.map((node, index) => {
    const { data } = node;
    const { lat, lon, uuid, name } = data;
    const size = getNodeSize(node);
    const nodeColor = getNodeColorMapVoyagesStyle(node);
    let radius = 0;
    if (size !== null) {
      radius = nodeLogValueScale(size);
    }

    if (lat && lon && radius) {
      return (
        <div key={`${uuid}-${name}-${index}`}>
          <CircleMarker
            center={[lat ?? 0, lon ?? 0]}
            radius={radius}
            key={`${uuid}-${name}-${index}`}
            weight={1.5}
            color="#000000"
            fillColor={nodeColor}
            fillOpacity={0.8}
          >
            <Popup>{name}</Popup>
          </CircleMarker>
        </div>
      );
    }
  });
  return nodeMarker;
};
export default NodeMarkerMap;
