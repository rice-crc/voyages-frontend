export interface Flatlabel {
    key: string;
    label: string;
    id: number;
    type: string;
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
    value: Record<string, never>;
}

export interface RangeSliderState {
    value: Record<string, number[]>
    range: number[]
    loading: boolean;
    error: boolean;
}
export const TYPES: {
    IntegerField: string;
    DecimalField: string;
    CharField: string;
} = {
    IntegerField: 'IntegerField',
    DecimalField: 'DecimalField',
    CharField: 'CharField'
};


export interface AutoCompleteSliceLists {
    results: string[][]
    total_results_count: number
}


export interface AutoCompleteLists {
    results: AutoCompleteOption[]
    total_results_count: number
}

export interface AutoCompleteOption {
    id: number
    label: string
}


export type YoyagaesFilterMenu = filterMenu[]

export interface filterMenu {
    label: string
    children: ChildrenFilter[]
}

export interface ChildrenFilter {
    var_name?: string
    type?: string
    label: string
    flatlabel?: string
    children?: ChildrenFilter[]
}
