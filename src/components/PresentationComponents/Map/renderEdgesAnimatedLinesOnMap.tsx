import { LatLng } from '@/share/InterfaceTypesMap';
import L, { CurveOptions } from 'leaflet';

const renderEdgesAnimatedLinesOnMap = (
  startLatLng: LatLng,
  endLatLng: LatLng,
  weight: number,
  controls: number[][]
): L.Curve | undefined => {
  const startControlLatLng: number[] = controls[0];
  const midpointControlLatLng: number[] = controls[1];

  if (startLatLng && endLatLng && weight && controls) {
    const curve = L.curve(
      [
        'M',
        startLatLng,
        'C',
        startControlLatLng as [number, number] | [number],
        midpointControlLatLng as [number, number] | [number],
        endLatLng,
      ],
      {
        dashArray: '1 9',
        fill: false,
        weight: weight / 1.4,
        color: '#0000ff8c',
        opacity: 0.8,
        stroke: true,
        fillColor: 'red',
        interactive: false,
        animate: { duration: 1000, iterations: Infinity },
      } as CurveOptions
    );
    return curve;
  }

  return undefined;
};
export default renderEdgesAnimatedLinesOnMap;
