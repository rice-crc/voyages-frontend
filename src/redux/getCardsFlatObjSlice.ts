import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { InitialStateTransatlanticCard } from '@/share/InterfaceTypes';
const initialState: InitialStateTransatlanticCard = {
    cardData: [],
    isModalCard: false,
    cardRowID: 0
};
export const getCardFlatObjectSlice = createSlice({
    name: 'getCardFlatObject',
    initialState,
    reducers: {
        setCardData: (state, action: PayloadAction<Record<string, any>[]>) => {
            state.cardData = action.payload;
        },
        setIsModalCard: (state, action: PayloadAction<boolean>) => {
            state.isModalCard = action.payload;
        },
        setCardRowID: (state, action: PayloadAction<number>) => {
            state.cardRowID = action.payload;
        },
    }
})

export const { setCardData, setIsModalCard, setCardRowID } = getCardFlatObjectSlice.actions;
export default getCardFlatObjectSlice.reducer;