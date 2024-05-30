import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterObjectsState, RolesProps } from '@/share/InterfaceTypes';

const initialState: FilterObjectsState = {
    rangeValue: {},
    loading: false,
    error: false,
    varName: '',
    isChange: false,
    rangeSliderMinMax: {},
    enslaversNameAndRole: [],
    enslaverName: '',
    opsRoles: 'andlist',
    listEnslavers: []
};

const rangeSliderSlice = createSlice({
    name: 'rangeSlider',
    initialState,
    reducers: {
        setRangeValue: (state, action: PayloadAction<Record<string, number[]>>) => {
            state.rangeValue = action.payload;
        },
        setKeyValueName: (state, action: PayloadAction<string>) => {
            state.varName = action.payload;
        },
        setIsChange: (state, action: PayloadAction<boolean>) => {
            state.isChange = action.payload;
        },
        setRangeSliderValue: (state, action: PayloadAction<Record<string, number[]>>) => {
            state.rangeSliderMinMax = action.payload;
        },
        setEnslaversName: (state, action: PayloadAction<string>) => {
            state.enslaverName = action.payload;
        },
        setEnslaversNameAndRole: (state, action: PayloadAction<RolesProps[] | undefined>) => {
            state.enslaversNameAndRole = action.payload;
        },
        setOpsRole: (state, action: PayloadAction<string>) => {
            state.opsRoles = action.payload;
        },
        setListEnslavers: (state, action: PayloadAction<RolesProps[]>) => {
            state.listEnslavers = action.payload;
        },
        resetSlice: (state) => initialState,
    },

});
export const { setEnslaversNameAndRole, setListEnslavers, setEnslaversName, setOpsRole, setRangeValue, setKeyValueName, setIsChange, resetSlice, setRangeSliderValue } = rangeSliderSlice.actions;
export default rangeSliderSlice.reducer;
