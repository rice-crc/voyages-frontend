import {
  AFRICANORIGINS,
  ALLENSLAVED,
  ENSALVEDTYPE,
  ENSALVERSTYLE,
  ENSLAVEDTEXAS,
  ESTIMATES,
  INTRAAMERICANTRADS,
  TRANSATLANTICTRADS,
} from '@/share/CONST_DATA';
import {
  TYPESOFBLOCKENSLAVED,
  TYPESOFBLOCKVOYAGES,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';

export const checkBlockCollectionNameForVoyages = (blockName: string) => {
  let collectionBlockName = '';
  switch (blockName) {
    case TYPESOFBLOCKVOYAGES.voyagesEN:
    case TYPESOFBLOCKVOYAGES.voyagesES:
    case TYPESOFBLOCKVOYAGES.voyagesPT:
      return (collectionBlockName = 'voyages');

    case TYPESOFBLOCKVOYAGES.summaryStatisticsEN:
    case TYPESOFBLOCKVOYAGES.summaryStatisticsES:
    case TYPESOFBLOCKVOYAGES.summaryStatisticsPT:
      return (collectionBlockName = 'summarystatistics');

    case TYPESOFBLOCKVOYAGES.lineEN:
    case TYPESOFBLOCKVOYAGES.lineES:
    case TYPESOFBLOCKVOYAGES.linePT:
      return (collectionBlockName = 'line');

    case TYPESOFBLOCKVOYAGES.barEN:
    case TYPESOFBLOCKVOYAGES.barES:
    case TYPESOFBLOCKVOYAGES.barPT:
      return (collectionBlockName = 'bar');

    case TYPESOFBLOCKVOYAGES.pieEN:
    case TYPESOFBLOCKVOYAGES.pieES:
    case TYPESOFBLOCKVOYAGES.piePT:
      return (collectionBlockName = 'pie');

    case TYPESOFBLOCKVOYAGES.tableEN:
    case TYPESOFBLOCKVOYAGES.tableES:
    case TYPESOFBLOCKVOYAGES.tablePT:
      return (collectionBlockName = 'table');

    case TYPESOFBLOCKVOYAGES.mapEN:
    case TYPESOFBLOCKVOYAGES.mapES:
    case TYPESOFBLOCKVOYAGES.mapPT:
      return (collectionBlockName = 'map');

    case TYPESOFBLOCKVOYAGES.timeLapseEN:
    case TYPESOFBLOCKVOYAGES.timeLapseES:
    case TYPESOFBLOCKVOYAGES.timeLapsePT:
      return (collectionBlockName = 'timelapse');

    default:
      return collectionBlockName;
  }
};

export const checkBlockCollectionNameForEnslaved = (blockName: string) => {
  let collectionBlockName = '';
  switch (blockName) {
    case TYPESOFBLOCKENSLAVED.enslavedEN:
    case TYPESOFBLOCKENSLAVED.enslavedES:
    case TYPESOFBLOCKENSLAVED.enslavedPT:
      return (collectionBlockName = 'people');
    case TYPESOFBLOCKENSLAVED.mapEN:
    case TYPESOFBLOCKENSLAVED.mapES:
    case TYPESOFBLOCKENSLAVED.mapPT:
      return (collectionBlockName = 'map');
    default:
      return collectionBlockName;
  }
};
