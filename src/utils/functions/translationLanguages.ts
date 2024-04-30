import { LabelFilterMeneList } from "@/share/InterfaceTypes";
import { EstimateTranslate } from "../languages/estimate_text";
import { saveSearchTranslated } from "../languages/save_search";
import { homePageTranslated } from "../languages/home_page_text";

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
    const translatedSaveSearch: Record<string, string> = {};
    for (const key in saveSearchTranslated) {
        if (Object.prototype.hasOwnProperty.call(saveSearchTranslated, key)) {
            const label = saveSearchTranslated[key].label;
            translatedSaveSearch[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedSaveSearch
}

export const translationHomepage = (languageValue: string) => {
    const translatedHompage: Record<string, string> = {};
    for (const key in homePageTranslated) {
        if (Object.prototype.hasOwnProperty.call(homePageTranslated, key)) {
            const label = homePageTranslated[key].label;
            translatedHompage[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedHompage
}