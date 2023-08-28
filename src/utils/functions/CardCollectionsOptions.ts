import CARDS_COLLECTION from '@/utils/flatfiles/transatlantic_voyages_card.json';

export const CardCollectionsOptions = (): any => {
    const columnObject: Record<string, any> = {};
    const processFieldsData = (fieldsData: any[]): void => {
        fieldsData.forEach((field) => {
            Object.entries(field).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    if (columnObject[key]) {
                        columnObject[key].push(value);
                    } else {
                        columnObject[key] = [value];
                    }
                } else if (typeof value === 'object' && value !== null) {
                    processFieldsData([value]);
                }
            });
        });
    };

    CARDS_COLLECTION.forEach((value) => {

        const fieldsData = value.children;
        processFieldsData(fieldsData);
    });
    // console.log("columnObject-->", columnObject)
    return columnObject;
};
