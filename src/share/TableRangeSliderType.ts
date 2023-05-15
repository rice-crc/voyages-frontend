export interface Flatlabel {
    key: string;
    label: string;
    id: number
}
export interface Options {
    [key: string]: VoyageOptionsValue;
}
export interface VoyageOptionsValue {
    type: string
    label: string
    flatlabel: string
}

export interface IsShowProp {
    [id: string]: boolean;
}


export interface OptionsDataState {
    value: Record<string, unknown>;
}