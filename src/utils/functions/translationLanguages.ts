import { LabelFilterMeneList } from "@/share/InterfaceTypes";
import { EstimateTranslate } from "../flatfiles/estimate_text";
import { saveSearchTranslated } from "../flatfiles/save_search";

export const translationLanguagesEstimatePage = (languageValue: string) => {
    const translatedEstimates: Record<string, string> = {};
    for (const key in EstimateTranslate) {
        if (Object.prototype.hasOwnProperty.call(EstimateTranslate, key)) {
            const label = EstimateTranslate[key].label;
            translatedEstimates[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedEstimates
}

export const translationLanguagesSaveSearch = (languageValue: string) => {
    const translatedEstimates: Record<string, string> = {};
    for (const key in saveSearchTranslated) {
        if (Object.prototype.hasOwnProperty.call(saveSearchTranslated, key)) {
            const label = saveSearchTranslated[key].label;
            translatedEstimates[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedEstimates
}