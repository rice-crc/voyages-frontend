export type DataSetCollectionType = DataSetCollectionProps[]

export interface DataSetCollectionProps {
    headers: Headers
    base_filter: BaseFilter[]
    style_name: string
    blocks: string[]
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
}
export interface InitialStateDataPeopleSetCollection {
    value: DataSetCollectionProps[];
    textHeader: string;
    textIntroduce: string;
    styleName: string;
    dataSetValueBaseFilter: BaseFilter[];
    dataSetKey: string;
    dataSetValue: string[] | number[];
    blocks: string[];
}