import { YOYAGESCARDFILE } from "@/share/CONST_DATA";
import { generateRowsData } from "./generateRowsData";
import { generateCardsData } from "./generateCardsData";
import CARDS_COLLECTION from '@/utils/flatfiles/transatlantic_voyages_card.json';

const cardDataArray = CARDS_COLLECTION;
export const processCardData = (data: Record<string, any>[]) => {
    if (data.length > 0) {
        const finalData = generateRowsData(data, YOYAGESCARDFILE);

        const newCardData: Record<string, any>[] = cardDataArray.map((value) => {
            const cardGroup = {
                header: value.label,
                childValue: value.children.map((child) => ({
                    label: child.label,
                    value: generateCardsData(finalData[0], child),
                })),
            };
            return cardGroup;
        });

        return newCardData;
    }
    return [];
};