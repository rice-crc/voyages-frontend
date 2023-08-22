import React from 'react';
import { PolylineMapProps } from '@/share/InterfaceTypesMap';
import { renderPolylineMap } from './renderPolylineMap';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const CurvedPolyLine = () => {
  const { nodesData, transportation, disposition, origination } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );
  transportation.forEach((edge) =>
    renderPolylineMap(nodesData, transportation, edge, 'transportation')
  );
  disposition?.forEach((edge) =>
    renderPolylineMap(nodesData, disposition, edge, 'disposition')
  );
  origination?.forEach((edge) =>
    renderPolylineMap(nodesData, origination, edge, 'origination')
  );
  return null;
};

export default CurvedPolyLine;
