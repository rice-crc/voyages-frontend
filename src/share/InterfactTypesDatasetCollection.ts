export type DataSetCollectionType = DataSetCollectionProps[]

export interface DataSetCollectionProps {
    headers: Headers
    base_filter: BaseFilter[]
    style_name: string
    blocks: string[]
    filter_menu_flatfile: string
    table_flatfile: string
}

export interface Headers {
    label: string
    text_introduce: string
}

export interface BaseFilter {
    var_name: string
    value: any[]
}


export interface InitialStateDataSetCollection {
    value: DataSetCollectionProps[];
    textHeader: string;
    textIntroduce: string;
    styleName: string;
    dataSetValueBaseFilter: BaseFilter[];
    dataSetKey: string;
    dataSetValue: string[] | number[];
    blocks: string[];
    filterMenuVoyageFlatfile: string;
    tableFlatfileVoyages: string
}
export interface InitialStateDataPeopleSetCollection {
    value: DataSetCollectionProps[];
    textHeader: string;
    textIntroduce: string;
    styleNamePeople: string;
    dataSetValueBaseFilter: BaseFilter[];
    dataSetKeyPeople: string;
    dataSetValuePeople: string[] | number[];
    blocksPeople: string[];
    filterMenuFlatfile: string,
    tableFlatfileEnslaved: string
}
export interface InitialStateDataPeopleEnslaversSetCollection {
    value: DataSetCollectionProps[];
    textHeader: string;
    textIntroduce: string;
    styleNamePeople: string;
    dataSetValueBaseFilter: BaseFilter[];
    dataSetKeyPeople: string;
    dataSetValuePeople: string[] | number[];
    blocksPeople: string[];
    filterMenuEnslaversFlatfile: string,
    tableFlatfileEnslavers: string
}