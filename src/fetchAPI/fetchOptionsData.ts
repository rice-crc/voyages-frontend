import { Flatlabel, Options, VoyageOptionsValue, TYPES } from '../share/InterfaceTypes';

export const fetchOptionsData = async (
    data: Options,
) => {
    const options: Flatlabel[] = [];
    Object.entries(data).forEach(([key, value]: [string, VoyageOptionsValue], index: number) => {
        const charField = value.type.replace(/'>/g, "").split(".");
        charField.forEach((type) => {
            if (type === TYPES.CharField) {
                options.push({ key, label: value.flatlabel, id: index, type: type } as Flatlabel);
            }
        });
    });
    return options;
};


export const fetchOptionsDataIntegerField = async (data: Options) => {
    const options: Flatlabel[] = [];
    Object.entries(data).forEach(([key, value]: [string, VoyageOptionsValue], index: number) => {
        const fieldTypes = [TYPES.IntegerField, TYPES.DecimalField];
        const fieldFound = value.type.replace(/'>/g, "").split(".").find((type) => fieldTypes.includes(type));
        if (fieldFound) {
            options.push({ key, label: value.flatlabel, id: index, type: fieldFound } as Flatlabel);
        }
    });
    return options;
};