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
    rangeValue: RangeSliderMinMaxInitialState
    loading: boolean;
    error: boolean;
    varName: string;
    isChange?: boolean
    rangeSliderMinMax: RangeSliderMinMaxInitialState
}
export interface RangeSliderMinMaxInitialState {
    [key: string]: number[]
}
export interface AutoCompleteInitialState {
    results: [],
    total_results_count: number,
    autoCompleteValue: Record<string, AutoCompleteOption[] | string[]>;
    autoLabelName: string[]
    isChangeAuto: boolean
}

export interface AutoCompleteValueInitialState {
    [key: string]: string[]
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

export const TYPESOFDATASETPEOPLE: {
    allEnslaved: string;
    allEnslavers: string
    africanOrigins: string;
    texas: string
} = {
    allEnslaved: 'all-enslaved',
    allEnslavers: 'all-enslavers',
    africanOrigins: 'african-origins',
    texas: 'texas'
};

export const TYPESOFDATASET: {
    allVoyages: string;
    intraAmerican: string;
    transatlantic: string;
    texas: string
} = {
    allVoyages: 'all-voyages',
    intraAmerican: 'intra-american',
    transatlantic: 'transatlantic',
    texas: 'texas'
};


export interface AutoCompleteSliceLists {
    results: string[]
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
export interface InitialStateFilterMenu {
    value: FilterMenu[]
}

export type VoyagaesFilterMenu = FilterMenu[]

export interface FilterMenu {
    label: string
    var_name?: string
    type?: string
    flatlabel?: string
    children?: ChildrenFilter[]
}

export interface ChildrenFilter {
    label?: string
    children?: ChildrenFilterArr[]
    var_name?: string
    type?: string
    flatlabel?: string
}
export interface ChildrenFilterArr {
    var_name: string
    type: string
    label: string
    flatlabel?: string
}


export interface ChildrenNewObjectProp {
    varName?: string
    subMenu: string | null
    id: number | null
    flatlabel?: string | null
    type?: string | null
}

export interface VoyageGroupby {
    [key: string]: VoyageGroupbyValue;
}
export interface VoyageGroupbyValue {
    [key: string]: number[]
}

export interface plotXYProps {
    x_vars: PlotXYVar[]
    y_vars: PlotXYVar[]
}

export interface PlotXYVar {
    var_name: string
    type?: string
    label: string
}
export interface PlotPieProps {
    x_vars: PlotPIEX[]
    y_vars: PlotPIEY[]
}

export interface PlotPIEX {
    var_name: string
    label: string
}

export interface PlotPIEY {
    var_name: string
    label: string
}
export interface BargraphXYVar {
    var_name: string
    type: string
    label: string
}

export interface PiegraphXYVar {
    var_name: string
    type: string
    label: string
}

export interface ScatterOptionsXYResponse {
    [key: string]: [];
}
export interface VoyagesOptionProps {
    x_vars: string;
    y_vars: string;
}


export interface AutocompleteBoxProps {
    value?: AutoCompleteOption[];
}

export interface CurrentPageInitialState {
    currentPage: number;
    isOpenDialog: boolean
    isOpenDialogMobile: boolean;
}

export interface HeaderNavBarMenuProps {
    window?: () => Window;
}


export interface NavProps {
    window?: () => Window;
}

export interface CanscandingMenuProps {
    window?: () => Window;
}

export interface ColumnObjectProps {
    [key: string]: string;
}


export interface TableColumnProps {
    header_label: string
    cell_type: string
    order_by_var: string
    cell_fields: CellVal
}

export interface CellVal {
    display: string
}

export interface InitialStateFilterPeopleMenu {
    value: ValuePeopleFilter
}
export interface ValuePeopleFilter {
    valueEnslaved: FilterPeopleMenu[]
    valueAfricanOrigin: FilterPeopleMenu[]
    valueTexas: FilterPeopleMenu[]
    valueEnslavers: FilterPeopleMenu[]
}
export type FilterPeopleMenuProps = FilterPeopleMenu[]
export interface FilterPeopleMenu {
    label: string
    var_name?: string
    type?: string
    children?: ChildrenPeopleMenu[]
}

export interface ChildrenPeopleMenu {
    var_name: string
    type: string
    label: string
    flatlabel?: string
}
