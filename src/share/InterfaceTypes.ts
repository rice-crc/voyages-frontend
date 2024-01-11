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
    autoCompleteValue: Record<string, string[]>;
    autoLabelName: string[]
    isChangeAuto: boolean
    offset: number
    isLoadingList: boolean
}

export interface IRootFilterObject {
    varName: string;
    querystr: string;
    offset: number;
    limit: number;
    filter: Filter[]
}
export interface IRootFilterObjectScatterRequest {
    groupby_by: string
    groupby_cols: string[]
    agg_fn: string
    cachename: string
    filter: Filter[]
}
export interface IRootFilterTableObject {
    filter: Filter[];
    page: number;
    page_size: number;
}

export interface Filter {
    varName: string
    searchTerm: number[] | string[]
    op: string
}
export interface RangeSliderStateProps {
    varName: string
    filter: Filter[]
}
export interface GeoTreeSelectStateProps {
    geotree_valuefields: string[]
    filter: Filter[]
}


export interface AutoCompleteValueInitialState {
    [key: string]: string[]
}

export const TYPES: {
    IntegerField: string;
    DecimalField: string;
    CharField: string;
    GeoTreeSelect: string;
} = {
    IntegerField: 'IntegerField',
    DecimalField: 'DecimalField',
    CharField: 'CharField',
    GeoTreeSelect: 'GeoTreeSelect',
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
    texas: 'texasEnslaved'
};

export const TYPESOFDATASET: {
    allVoyages: string;
    intraAmerican: string;
    transatlantic: string;
    texas: string
    voyages: string
} = {
    allVoyages: 'all-voyages',
    intraAmerican: 'intra-american',
    transatlantic: 'trans-atlantic',
    texas: 'texas',
    voyages: 'voyages'
};


export interface AutoCompleteSliceLists {
    results: string[]
    total_results_count: number
}


export interface AutoCompleteLists {
    results: AutoCompleteOption[]
    total_results_count: number
}
export interface DataAutoCompleteProp {
    data: DataSuggestedValuesProps
}

export interface DataSuggestedValuesProps {
    suggested_values: AutoCompleteOption[]
}

export interface AutoCompleteOption {
    value: string
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
    currentVoyageBlockName: string
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
export interface TableListPropsRequest {
    filter: Filter[]
    page: number
    page_size: number
}
export interface MapPropsRequest {
    zoomlevel: string
    filter: Filter[]
    id?: string
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


export interface PivotTablesProps {
    row_vars: string
    rows_label: string
    column_vars: string[]
    cell_vars: string
    cachename: string
}

export interface PivotRowVar {
    var_name: string
    label: string
}

export interface PivotColumnVar {
    var_name: string[]
    label: string
}

export interface PivotCellVar {
    var_name: string
    label: string
}
export interface InitialStateTransatlanticCard {
    cardData: Record<string, any>[]
    isModalCard: boolean
    cardRowID: number
    cardFileName: string
    cardDataArray: TransatlanticCardProps[]
    nodeTypeClass: string
    variable: string
}
export interface TransatlanticCardProps {
    label: string
    children: ChildrenCard[]
}

export interface ChildrenCard {
    cell_type: string
    cell_val?: CellValCard
    label: string
    var_names?: string

}

export interface CellValCard {
    fields: FieldCard[],
    join?: string
}

export interface FieldCard {
    var_name: string
    cell_fn: string
}

export interface GeoTreeSelectValueInitialState {
    [key: string]: string[]
}

export interface GeoTreeSelectItem {
    id: number
    name: string
    longitude: string
    latitude: string
    value: number
    location_type: LocationType
    spatial_extent: any
    children: GeoTreeSelectChildren[]
}
export interface LocationType {
    name: string
}
export interface GeoTreeSelectChildren {
    id: number
    name: string
    longitude?: string
    latitude?: string
    value: number
    location_type: LocationType
    spatial_extent: any
    children: GeoTreeSelectGrandChildren[]
}

export interface GeoTreeSelectGrandChildren {
    id: number
    name: string
    longitude: string
    latitude: string
    value: number
    location_type: LocationType
    spatial_extent: any
}
export interface TreeSelectItemInitialState {
    geoTreeValue: Record<string, GeoTreeSelectItem[] | string[]>;
    geoTreeSelectValue: string[]
    isChangeGeoTree: boolean
}


export interface InitialStateFilterMenuProps {
    filterValueList: ValueFilterList;
}

export interface ValueFilterList {
    valueVoyages: FilterMenuList[];
    valueEnslaved: FilterMenuList[];
    valueAfricanOrigin: FilterMenuList[];
    valueEnslavedTexas: FilterMenuList[];
    valueEnslavers: FilterMenuList[];
}

export interface FilterMenuList {
    label: string;
    var_name?: string;
    type?: string;
    flatlabel?: string;
    children?: ChildrenFilter[];
}
export interface FetchAutoVoyageParams {
    varName?: string;
    autoValue?: string;
    offset?: number;
    limit?: number;
}

export interface RenderRowProps {
    data: React.ReactNode[];
    index: number;
    style: React.CSSProperties;
}
