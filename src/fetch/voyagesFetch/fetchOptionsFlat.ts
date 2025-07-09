import { Options, VoyageOptionsValue } from '@/share/InterfaceTypes';

export const fetchOptionsFlat = (
  isSuccess: boolean,
  options_flat: Record<string, unknown> | undefined,
) => {
  if (isSuccess && options_flat) {
    const options: Options = {};
    Object.entries(options_flat).forEach(([key, value]) => {
      options[key] = value as VoyageOptionsValue;
    });

    return options;
  }
};
