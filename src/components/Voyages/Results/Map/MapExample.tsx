import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { default as bezierSpline } from '@turf/bezier-spline';
import * as helpers from '@turf/helpers';
import { LatLngTuple } from 'leaflet';

interface MapExampleProps {
  center: LatLngTuple;
  zoom: number;
}

const MapExample: React.FC<MapExampleProps> = (props) => {
  const line = helpers.lineString(
    [
      [52.5069704, 13.2846501],
      [47.3775499, 8.4666755],
      [51.5287718, -0.2416804],
    ].map((lngLat) => [lngLat[1], lngLat[0]])
  );

  const curved = bezierSpline(line);

  return (
    <MapContainer
      center={props.center}
      zoom={props.zoom}
      style={{ width: '80%', height: 500 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default MapExample;
