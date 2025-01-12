import { generateRowsData } from './generateRowsData';
import { generateCardsData } from './generateCardsData';
import { TransatlanticCardProps } from '@/share/InterfaceTypes';

export const processCardData = (
  data: Record<string, any>[],
  cardDataArray: TransatlanticCardProps[],
  fileCardName: string,
  languageValue: string
) => {

  if (data.length > 0) {
    const finalData = generateRowsData(data, fileCardName);
    const newCardData: Record<string, any>[] = cardDataArray.map((value) => {
      const cardGroup = {
        header: value.label[languageValue],
        childValue: value?.children?.map((child) => {
          return {
            label: child.label[languageValue],
            value: generateCardsData(finalData[0], child),
            number_format: child.number_format,
          };
        }),
      };
      return cardGroup;
    });
    return newCardData;
  }
  return [];
};
