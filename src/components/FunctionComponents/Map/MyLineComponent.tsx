import { LatLngExpression } from 'leaflet';
import React from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';

import { Polyline } from 'react-leaflet';

const MyLineComponent = () => {
  const lineCoordinates: LatLngExpression[] = [
    [51.505, -0.09], // Start point (latitude, longitude)
    [51.51, -0.1], // Intermediate point
    [51.52, -0.15], // End point
  ];

  return <Polyline positions={lineCoordinates} color="blue" />;
};

const YourMapComponent = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Map Layer">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked name="Voyages">
          <MyLineComponent />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};
