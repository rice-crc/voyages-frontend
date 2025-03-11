import { AFRICANORIGINS, ALLENSLAVED, ENSLAVEDTEXAS } from '@/share/CONST_DATA';
import { TYPESOFDATASET } from '@/share/InterfaceTypes';

export const getMapBackgroundColor = (item: string) => {
  let background = 'rgb(55, 148, 141)';
  if (item === TYPESOFDATASET.allVoyages) {
    background = 'rgb(55, 148, 141)';
  } else if (item === TYPESOFDATASET.allVoyages) {
    background = 'transparent';
  } else if (item === TYPESOFDATASET.intraAmerican) {
    background = 'rgba(127, 118, 191)';
  } else if (item === TYPESOFDATASET.transatlantic) {
    background = '#1976d2';
  } else if (item === TYPESOFDATASET.texas) {
    background = 'rgba(187, 105, 46)';
  } else if (item === AFRICANORIGINS) {
    background = '#1976d2';
  } else if (item === ENSLAVEDTEXAS) {
    background = 'rgba(187, 105, 46)';
  } else if (item === ALLENSLAVED) {
    background = 'rgb(178, 148, 147)';
  }
  return background;
};
