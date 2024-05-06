import { DatabasePageProps } from '@/share/InterfaceTypeLanguages';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'



const initialStateLanguages: DatabasePageProps = {
    databasePageValue: 'voyages',
    databasePageValueLabel: 'Voyages',
}

export const getDabasePagesSlice = createSlice({
    name: 'getDabasePagesSlice',
    initialState: initialStateLanguages,
    reducers: {
        setDataBasesPage: (state, action: PayloadAction<string>) => {
            state.databasePageValue = action.payload;
        },
        setDataBasesPageLabel: (state, action: PayloadAction<string>) => {
            state.databasePageValueLabel = action.payload;
        },
    },
});

export const { setDataBasesPage, setDataBasesPageLabel } = getDabasePagesSlice.actions;

export default getDabasePagesSlice.reducer;
