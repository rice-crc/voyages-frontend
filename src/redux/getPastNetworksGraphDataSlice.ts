import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialStatePastNetworksData, Datas } from '@/share/InterfaceTypePastNetworks';

const initialState: InitialStatePastNetworksData = {
    data: {
        nodes: [],
        edges: []
    }
};

const pastNetworksSlice = createSlice({
    name: 'pastNetworks',
    initialState,
    reducers: {
        setPastNetworksData: (state, action: PayloadAction<Datas>) => {
            state.data = action.payload;
        }
    }
});

export const { setPastNetworksData } = pastNetworksSlice.actions;
export default pastNetworksSlice.reducer;
