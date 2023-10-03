import {
    EdgesAggroutes,
    InitialStateNodeEdgesAggroutesMapData,
    NodeAggroutes,
    PathsAggroutes,
} from '@/share/InterfaceTypesMap';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: InitialStateNodeEdgesAggroutesMapData = {
    mapData: {
        edges: [],
        nodes: [],
        paths: [],
    },
    edgesData: [],
    nodesData: [],
    pathsData: [],
};

const getNodeEdgesAggroutesMapDataSlice = createSlice({
    name: 'pastNetworks',
    initialState,
    reducers: {
        setMapData: (state, action: PayloadAction<InitialStateNodeEdgesAggroutesMapData['mapData']>) => {
            state.mapData = action.payload;
        },
        setNodesData: (state, action: PayloadAction<NodeAggroutes[]>) => {
            state.nodesData = action.payload;
        },
        setEdgesData: (state, action: PayloadAction<EdgesAggroutes[]>) => {
            state.edgesData = action.payload;
        },
        setPathsData: (state, action: PayloadAction<PathsAggroutes[]>) => {
            state.pathsData = action.payload;
        },
        resetSlice: (state) => initialState,
    }
});

export const { resetSlice, setNodesData, setMapData, setEdgesData, setPathsData } = getNodeEdgesAggroutesMapDataSlice.actions;
export default getNodeEdgesAggroutesMapDataSlice.reducer;
