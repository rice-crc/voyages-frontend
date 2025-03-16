//https://www.slavevoyages.org/contribute/interim/new/2976
const generateId = '';
export const getDisplayButtons = (translatedContribute: any) => [
  {
    nameBtn: translatedContribute.contributeNewVoyage,
    path: `/contribute/interim/new/${generateId}`,
  },
  {
    nameBtn: translatedContribute.contributeEditExistingVoyage,
    path: `/contribute/edit_voyage`,
  },
  {
    nameBtn: translatedContribute.contributeMergeVoyages,
    path: `/contribute/merge_voyages`,
  },
  {
    nameBtn: translatedContribute.contributeDeleteVoyage,
    path: `/contribute/delete_voyage`,
  },
];
