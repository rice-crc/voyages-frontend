export interface GlobalSearchProp {
  type: string;
  results_count: number;
  ids: number[];
}

export interface InitialStateGlobalSearchProp {
  data: GlobalSearchProp[];
}
export const initialStateGlobalSearch = {
  data: [],
};
