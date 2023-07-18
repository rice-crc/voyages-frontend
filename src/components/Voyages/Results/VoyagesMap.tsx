import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression, circleMarker, map, tileLayer } from 'leaflet';
import '@/style/map.scss';
import { useGetOptionsQuery } from '@/fetchAPI/voyagesApi/fetchApiService';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoyagesMap } from '@/fetchAPI/voyagesApi/fetchVoyagesMap';

interface MarkerData {
  lat: number;
  lng: number;
  color: string;
  radius: number;
}

function VoyagesMap() {
  const center: [number, number] = [23.486678, -88.59375];
  const zoom: number = 5;
  const [nodesData, setNodesData] = useState([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    let subscribed = true;
    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      try {
        const response = await dispatch(fetchVoyagesMap(newFormData)).unwrap();
        if (subscribed) {
          const { nodes } = response;
          setNodesData(nodes);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchData();
    return () => {
      subscribed = false;
    };
  }, []);
  console.log('nodesData-->', nodesData);
  var mbaccesstoken =
    'pk.eyJ1IjoiamNtMTAiLCJhIjoiY2xid2VpZmF3MDhsaTN1bGhqMXZ5YmxjZCJ9.eP7ZuC68Q5iBZQa8I13AGw';
  // L.tileLayer(
  //     'https://api.mapbox.com/styles/v1/jcm10/clbmdqh2q000114o328k5yjpf/tiles/{z}/{x}/{y}?access_token='+mbaccesstoken,
  //     {attribution: '<a href="https://www.mappingspecialists.com/" target="blank">Mapping Specialists, Ltd.</a>'});

  return (
    <div id="map" className="map-contenter">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: 1000 }}
      >
        <TileLayer url="https://api.mapbox.com/styles/v1/jcm10/clbmdqh2q000114o328k5yjpf/tiles/%7Bz%7D/%7Bx%7D/%7By%7D?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2xid2VpZmF3MDhsaTN1bGhqMXZ5YmxjZCJ9.eP7ZuC68Q5iBZQa8I13AGw" />
      </MapContainer>
    </div>
  );
}

export default VoyagesMap;
