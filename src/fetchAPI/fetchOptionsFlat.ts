import { Options, VoyageOptionsValue } from "../share/InterfaceTypes";

export const fetchOptionsFlat = (
    isSuccess: boolean,
    options_flat: Record<string, unknown> | undefined,
    setOptionsFlat: (value: React.SetStateAction<Options>) => void
) => {
    if (isSuccess && options_flat) {
        const options: Options = {};
        Object.entries(options_flat).forEach(([key, value]) => {
            options[key] = value as VoyageOptionsValue;
        });
        setOptionsFlat(options);
        return options;
    }
};
