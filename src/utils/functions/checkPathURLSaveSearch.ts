import { ALLVOYAGES, INTRAAMERICAN, TRANSATLANTIC } from '@/share/CONST_DATA';

export function checkPathURLSaveSearchVoyages(url: string) {
  let checkURLVoyage = INTRAAMERICAN;
  if (url.includes(ALLVOYAGES)) {
    checkURLVoyage = ALLVOYAGES;
  } else if (url.includes(INTRAAMERICAN)) {
    checkURLVoyage = INTRAAMERICAN;
  } else if (url.includes(TRANSATLANTIC)) {
    checkURLVoyage = TRANSATLANTIC;
  }
  return checkURLVoyage;
}

export function checkPathURLSaveSearchPeople(url: string) {
  // else if (url.includes('/voyage/') && filtersObj.some(obj => obj.varName === 'dataset' && obj.searchTerm.includes(0, 0))) {
  //     navigate('/voyage/other-url#voyages');
  // } else {
  //     // Handle other cases or navigate to a default URL
  //     navigate('/default-url');
  // }
}
