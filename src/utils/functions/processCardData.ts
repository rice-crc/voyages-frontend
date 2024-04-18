import { generateRowsData } from "./generateRowsData";
import { generateCardsData } from "./generateCardsData";
import { TransatlanticCardProps } from "@/share/InterfaceTypes";

export const processCardData = (data: Record<string, any>[], cardDataArray: TransatlanticCardProps[], fileCardName: string) => {
    if (data.length > 0) {
        const finalData = generateRowsData(data, fileCardName);
        const newCardData: Record<string, any>[] = cardDataArray.map((value) => {
            const cardGroup = {
                header: value.label,
                childValue: value?.children?.map((child) => {
                    return ({
                        label: child.label,
                        value: generateCardsData(finalData[0], child),
                    })
                }),
            };
            return cardGroup;
        });
        return newCardData;
    }
    return [];
};