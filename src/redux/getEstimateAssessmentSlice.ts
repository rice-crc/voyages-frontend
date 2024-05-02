
import { InitialStateDataEstimateAssesment } from "@/share/InterfaceTypes";
import { disembarkationListData, embarkationListData, flagText } from "@/utils/languages/estimate_text";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CheckboxValueType } from "antd/es/checkbox/Group";

export const initialState: InitialStateDataEstimateAssesment = {
    selectedFlags: flagText.map(value => value),
    currentSliderValue: [],
    changeFlag: false,
    checkedListEmbarkation: embarkationListData.reduce((acc, group) => {
        acc[group.label] = group.options || [];
        return acc;
    }, {} as Record<string, CheckboxValueType[]>),

    checkedListDisEmbarkation: disembarkationListData.reduce((acc, group) => {
        acc[group.label] = group.options || [];
        return acc;
    }, {} as Record<string, CheckboxValueType[]>),
}

export const getEstimateAssessmentSlice = createSlice({
    name: 'getEstimateAssesment',
    initialState,
    reducers: {
        setCurrentSliderValue: (state, action: PayloadAction<number[]>) => {
            state.currentSliderValue = action.payload;
        },
        setSelectedFlags: (state, action: PayloadAction<CheckboxValueType[]>) => {
            state.selectedFlags = action.payload;
        },
        setOnChangeFlag: (state, action: PayloadAction<boolean>) => {
            state.changeFlag = action.payload;
        },
        setCheckedListEmbarkation: (state, action: PayloadAction<Record<string, CheckboxValueType[]>>) => {
            state.checkedListEmbarkation = action.payload;
        },
        setCheckedListDisEmbarkation: (state, action: PayloadAction<Record<string, CheckboxValueType[]>>) => {
            state.checkedListDisEmbarkation = action.payload;
        },

        resetAllStateSlice: (state) => initialState,
    }

})
export const { setSelectedFlags, setCurrentSliderValue, setOnChangeFlag, resetAllStateSlice, setCheckedListEmbarkation, setCheckedListDisEmbarkation } = getEstimateAssessmentSlice.actions;
export default getEstimateAssessmentSlice.reducer;
