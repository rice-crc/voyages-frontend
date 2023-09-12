import { GeoTreeSelectDataProps } from "@/share/InterfaceTypes";

export function getGeoValuesCheck(values: string[], geo_array: GeoTreeSelectDataProps[]) {
    geo_array.forEach((child) => {
        values.push(String(child.value));
        if (child.children) {
            getGeoValuesCheck(values, child.children);
        }
    });
    return values;
}