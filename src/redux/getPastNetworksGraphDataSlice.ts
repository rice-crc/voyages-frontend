import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialStatePastNetworksData, Datas, Nodes, Edges } from '@/share/InterfaceTypePastNetworks';

const initialState: InitialStatePastNetworksData = {
    data: {
        nodes: [],
        edges: []
    },
    nodes: [],
    edges: [],
    openModal: false,
    networkID: null,
    networkKEY: '',
};

const getPastNetworksGraphDataSlice = createSlice({
    name: 'pastNetworks',
    initialState,
    reducers: {
        setPastNetworksData: (state, action: PayloadAction<Datas>) => {
            state.data = action.payload;
        },
        setNetworkNode: (state, action: PayloadAction<Nodes[]>) => {
            state.nodes = [...action.payload];
        },
        setNetworkEdges: (state, action: PayloadAction<Edges[]>) => {
            state.edges = [...action.payload];
        },
        setsetOpenModalNetworks: (state, action: PayloadAction<boolean>) => {
            state.openModal = action.payload;
        },
        setNetWorksID: (state, action: PayloadAction<number | null>) => {
            state.networkID = action.payload;
        },
        setNetWorksKEY: (state, action: PayloadAction<string>) => {
            state.networkKEY = action.payload;
        },
    },
});

export const { setPastNetworksData, setNetworkNode, setNetworkEdges, setsetOpenModalNetworks, setNetWorksID, setNetWorksKEY } = getPastNetworksGraphDataSlice.actions;
export default getPastNetworksGraphDataSlice.reducer;
