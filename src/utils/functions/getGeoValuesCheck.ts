import {
  GeoTreeSelectChildren,
  GeoTreeSelectItem,
} from '@/share/InterfaceTypes';

export function getGeoValuesCheck(
  values: string[],
  geo_array: (GeoTreeSelectItem | GeoTreeSelectChildren)[]
) {
  geo_array.forEach((child) => {
    values.push(String(child.value));
    if (Array.isArray(child.children)) {
      getGeoValuesCheck(values, child.children);
    }
  });
  return values;
}
