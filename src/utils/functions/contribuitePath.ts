//https://www.slavevoyages.org/contribute/interim/new/2976
import React from 'react';
import { Add, Edit, Merge, Delete } from '@mui/icons-material';
const generateId = '';
export const getDisplayButtons = (translatedContribute: any) => [
  {
    nameBtn: translatedContribute.contributeNewVoyage,
    path: `/contribute/interim/new/${generateId}`,
    icon: React.createElement(Add)
  },
  {
    nameBtn: translatedContribute.contributeEditExistingVoyage,
    path: `/contribute/edit_voyage`,
    icon: React.createElement(Edit)
  },
  {
    nameBtn: translatedContribute.contributeMergeVoyages,
    path: `/contribute/merge_voyages`,
    icon: React.createElement(Merge)
  },
  {
    nameBtn: translatedContribute.contributeDeleteVoyage,
    path: `/contribute/delete_voyage`,
    icon: React.createElement(Delete)
  },
];
