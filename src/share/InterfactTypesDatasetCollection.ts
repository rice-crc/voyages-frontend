import { LabelFilterMeneList } from './InterfaceTypes';

export type DataSetCollectionType = DataSetCollectionProps[];

export interface DataSetCollectionProps {
  headers: Headers;
  base_filter: BaseFilter[];
  style_name: string;
  blocks: BlockCollectionProps[]; // string[]
  filter_menu_flatfile: string;
  table_flatfile: string;
}
export interface BlockCollectionProps {
  label: LabelFilterMeneList;
}

export interface Headers {
  label: LabelFilterMeneList;
  text_introduce: string;
}

export interface BaseFilter {
  var_name: string;
  value: any[] | number;
}

export interface InitialStateDataSetCollection {
  value: DataSetCollectionProps[];
  textHeader: string;
  textIntroduce: string;
  styleName: string;
  dataSetValueBaseFilter: BaseFilter[];
  blocks: BlockCollectionProps[];
  filterMenuVoyageFlatfile: string;
  tableFlatfileVoyages: string;
}
export interface InitialStateDataPeopleSetCollection {
  value: DataSetCollectionProps[];
  textHeader: string;
  textIntroduce: string;
  styleNamePeople: string;
  dataSetValueBaseFilter: BaseFilter[];
  dataSetKeyPeople: string;
  dataSetValuePeople: string[] | number[];
  blocksPeople: BlockCollectionProps[];
  filterMenuFlatfile: string;
  tableFlatfileEnslaved: string;
}
export interface InitialStateDataPeopleEnslaversSetCollection {
  value: DataSetCollectionProps[];
  textHeader: string;
  textIntroduce: string;
  styleNamePeople: string;
  dataSetValueBaseFilter: BaseFilter[];
  dataSetKeyPeople: string;
  dataSetValuePeople: string[] | number[];
  blocksEnslavers: BlockCollectionProps[];
  filterMenuEnslaversFlatfile: string;
  tableFlatfileEnslavers: string;
}
