
import { InitialStateDataEstimateAssesment } from "@/share/InterfaceTypes";
import { flagText } from "@/utils/flatfiles/estimate_text";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CheckboxValueType } from "antd/es/checkbox/Group";

export const initialState: InitialStateDataEstimateAssesment = {
    currentSliderValue: [],
    // selectedFlags: flagText
    changeFlag: false
}

export const getEstimateAssessmentSlice = createSlice({
    name: 'getEstimateAssesment',
    initialState,
    reducers: {
        setCurrentSliderValue: (state, action: PayloadAction<number[]>) => {
            state.currentSliderValue = action.payload;
        },
        setOnChangeFlag: (state, action: PayloadAction<boolean>) => {
            state.changeFlag = action.payload;
        },
        // setSelectedFlags: (state, action: PayloadAction<CheckboxValueType[]>) => {
        //     console.log('--->', action.payload)
        //     state.selectedFlags = action.payload;
        // },
        resetAllStateSlice: (state) => initialState,
    }

})
export const { setCurrentSliderValue, setOnChangeFlag, resetAllStateSlice } = getEstimateAssessmentSlice.actions;
export default getEstimateAssessmentSlice.reducer;
