import {
    Dispositions,
    InitialStateNodeEdgesAggroutesMapData,
    NodeAggroutes,
    Originations,
    Transportation,
} from '@/share/InterfaceTypesMap';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: InitialStateNodeEdgesAggroutesMapData = {
    nodesData: [],
    transportation: [],
    disposition: [],
    origination: []
};

const getNodeEdgesAggroutesMapDataSlice = createSlice({
    name: 'pastNetworks',
    initialState,
    reducers: {
        setNodesData: (state, action: PayloadAction<NodeAggroutes[]>) => {
            state.nodesData = action.payload;
        },
        setTransportation: (state, action: PayloadAction<Transportation[]>) => {
            state.transportation = action.payload;
        },
        setDisposition: (state, action: PayloadAction<Dispositions[]>) => {
            state.disposition = action.payload;
        },
        setOrigination: (state, action: PayloadAction<Originations[]>) => {
            state.origination = action.payload;
        },
        resetSlice: (state) => initialState,
    }
});

export const { resetSlice, setNodesData, setTransportation, setDisposition, setOrigination } = getNodeEdgesAggroutesMapDataSlice.actions;
export default getNodeEdgesAggroutesMapDataSlice.reducer;
