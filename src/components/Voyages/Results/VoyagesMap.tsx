import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
} from 'react-leaflet';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { fetchVoyagesMap } from '@/fetchAPI/voyagesApi/fetchVoyagesMap';
import { NodeAggroutes, Transportation } from '@/share/InterfaceTypesMap';
import * as d3 from 'd3';
import '@/style/map.scss';
interface Node {
  s: string;
  t: string;
}

function VoyagesMap() {
  const center: [number, number] = [23.486678, -88.59375];
  const zoom: number = 3;
  const [nodesData, setNodesData] = useState<NodeAggroutes[]>([]);
  const [transportation, setTransportation] = useState<Transportation[]>([]);
  const [weight, setWeight] = useState({ color: 'lime' });
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    let subscribed = true;
    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      try {
        const response = await dispatch(fetchVoyagesMap(newFormData)).unwrap();
        if (subscribed) {
          const { nodes, edges } = response;
          const { transportation } = edges;
          setNodesData(nodes);
          setTransportation(transportation);
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

  function getNodeSize(node: any) {
    const weightsVal = Object.keys(node.weights).length !== 0;
    if (weightsVal) {
      const w = node.weights;
      return w.disembarkation + w.embarkation;
    } else {
      return null;
    }
  }

  let minNodeSize = Infinity;
  let maxNodeSize = -Infinity;

  const nodesDict: { [key: string]: any } = {};
  nodesData.forEach((node) => {
    nodesDict[node.id] = [node.data.lat, node.data.lon];
    const nodeSize = getNodeSize(node);
    if (nodeSize) {
      if (nodeSize < minNodeSize) {
        minNodeSize = nodeSize;
      }
      if (nodeSize > maxNodeSize) {
        maxNodeSize = nodeSize;
      }
    }
  });
  const minradiusinpixels = 3;
  const maxradiusinpixels = 25;

  const nodelogvaluescale = d3.scaleLog(
    [minNodeSize, maxNodeSize],
    [minradiusinpixels, maxradiusinpixels]
  );

  const nodeMarker = nodesData.map((node) => {
    const { data } = node;
    const { lat, lon, uuid } = data;
    const size = getNodeSize(node);
    const radius = nodelogvaluescale(size);
    return (
      lat &&
      lon &&
      size > 0 && (
        // <Marker position={[lat, lon]} key={uuid}>
        //   <Popup>{name}</Popup>
        // </Marker>
        <>
          <CircleMarker center={[lat, lon]} radius={radius} key={uuid} />
        </>
      )
    );
  });

  const polylineTransportation = transportation.map((edge, idx) => {
    // console.log(edge);
    // console.log(typeof target);
    const source = nodesDict[edge.s];
    const target = nodesDict[edge.t];

    if (source && target) {
      const polyline = [source, target];
      return (
        <div key={idx}>
          <Polyline
            pathOptions={weight}
            positions={polyline}
            color="blue"
            weight={1}
          />
        </div>
      );
    }
  });

  return (
    <MapContainer center={center} zoom={zoom} className="map-container ">
      <TileLayer url="https://api.mapbox.com/styles/v1/jcm10/clbmdqh2q000114o328k5yjpf/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2xid2VpZmF3MDhsaTN1bGhqMXZ5YmxjZCJ9.eP7ZuC68Q5iBZQa8I13AGw" />
      {nodeMarker}
      {/* <Circle center={[50.5, 30.5]} radius={200} /> */}
      {polylineTransportation}
    </MapContainer>
  );
}

export default VoyagesMap;
