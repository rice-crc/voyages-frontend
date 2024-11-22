import {LabelFilterMeneList} from "@/share/InterfaceTypes";
import {EstimateTranslate} from "../languages/estimate_text";
import {saveSearchTranslated} from "../languages/save_search";
import {homePageTranslated} from "../languages/home_page_text";
import {cardTranslated} from "../languages/card";
import {connectionTranslated} from "../languages/connection_text";
import {timelapseTranslated} from '../languages/timelapse_text';
import {ContributeTranslate} from "../languages/contribute_text";

export const translationLanguagesEstimatePage = (languageValue: string) => {
    const translatedEstimates: Record<string, string> = {};
    for (const key in EstimateTranslate) {
        if (Object.prototype.hasOwnProperty.call(EstimateTranslate, key)) {
            const label = EstimateTranslate[key].label;
            translatedEstimates[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedEstimates;
};

export const translationLanguagesSaveSearch = (languageValue: string) => {
    const translatedSaveSearch: Record<string, string> = {};
    for (const key in saveSearchTranslated) {
        if (Object.prototype.hasOwnProperty.call(saveSearchTranslated, key)) {
            const label = saveSearchTranslated[key].label;
            translatedSaveSearch[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedSaveSearch;
};

export const translationHomepage = (languageValue: string) => {
    const translatedHomepage: Record<string, string> = {};
    for (const key in homePageTranslated) {
        if (Object.prototype.hasOwnProperty.call(homePageTranslated, key)) {
            const label = homePageTranslated[key].label;
            translatedHomepage[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedHomepage;
};

export const translationDataBasePage = (languageValue: string) => {
    const translatedPage: Record<string, string> = {};
    for (const key in homePageTranslated) {
        if (Object.prototype.hasOwnProperty.call(homePageTranslated, key)) {
            const label = homePageTranslated[key].label;
            translatedPage[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedPage;
};

export const translationCard = (languageValue: string) => {
    const translatedCard: Record<string, string> = {};
    for (const key in cardTranslated) {
        if (Object.prototype.hasOwnProperty.call(cardTranslated, key)) {
            const label = cardTranslated[key].label;
            translatedCard[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return translatedCard;
};

export const translatedConnection = (languageValue: string) => {

    const tanslateConnection: Record<string, string> = {};
    for (const key in connectionTranslated) {
        if (Object.prototype.hasOwnProperty.call(connectionTranslated, key)) {
            const label = connectionTranslated[key].label;
            tanslateConnection[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return tanslateConnection;
};
export const translationLanguagesTimelapse = (languageValue: string) => {
    const tanslateTimelapse: Record<string, string> = {};
    for (const key in timelapseTranslated) {
        if (Object.prototype.hasOwnProperty.call(timelapseTranslated, key)) {
            const label = timelapseTranslated[key].label;
            tanslateTimelapse[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return tanslateTimelapse;
};

export const translationLanguagesContribute = (languageValue: string) => {
    const contributeTranslate: Record<string, string> = {};
    for (const key in ContributeTranslate) {
        if (Object.prototype.hasOwnProperty.call(ContributeTranslate, key)) {
            const label = ContributeTranslate[key].label;
            contributeTranslate[key] = (label as LabelFilterMeneList)[languageValue];
        }
    }
    return contributeTranslate;
};