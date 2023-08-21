import React from 'react';
import { PolylineMapProps } from '@/share/InterfaceTypesMap';
import { renderPolylineMap } from './RenderPolylineMap';

const CurvedPolyLine: React.FC<PolylineMapProps> = ({
  transportation,
  nodesData,
  origination,
  disposition,
}) => {
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
