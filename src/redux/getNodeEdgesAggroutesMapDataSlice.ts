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
    hasFetchedRegion: true,
    clusterNodeKeyVariable: '',
    clusterNodeValue: ''

};

const getNodeEdgesAggroutesMapDataSlice = createSlice({
    name: 'pastNetworks',
    initialState,
    reducers: {
        setMapData: (state, action: PayloadAction<InitialStateNodeEdgesAggroutesMapData['mapData']>) => {
            state.mapData = action.payload;
        },
        setNodesDataRegion: (state, action: PayloadAction<NodeAggroutes[]>) => {
            state.nodesData = action.payload;
        },
        setNodesDataPlace: (state, action: PayloadAction<NodeAggroutes[]>) => {
            state.nodesData = action.payload;
        },
        setEdgesDataRegion: (state, action: PayloadAction<EdgesAggroutes[]>) => {
            state.edgesData = action.payload;
        },
        setEdgesDataPlace: (state, action: PayloadAction<EdgesAggroutes[]>) => {
            state.edgesData = action.payload;
        },
        setPathsData: (state, action: PayloadAction<PathsAggroutes[]>) => {
            state.pathsData = action.payload;
        },
        setHasFetchedRegion: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedRegion = action.payload;
        },
        setClusterNodeKeyVariable: (state, action: PayloadAction<string>) => {
            state.clusterNodeKeyVariable = action.payload;
        },
        setClusterNodeValue: (state, action: PayloadAction<string>) => {
            state.clusterNodeValue = action.payload;
        },
        resetSlice: (state) => initialState,
    }
});

export const { resetSlice, setNodesDataRegion, setHasFetchedRegion, setNodesDataPlace, setMapData, setEdgesDataRegion, setEdgesDataPlace, setPathsData, setClusterNodeKeyVariable, setClusterNodeValue } = getNodeEdgesAggroutesMapDataSlice.actions;
export default getNodeEdgesAggroutesMapDataSlice.reducer;
