import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ValuePeopleFilter, InitialStateFilterPeopleMenu } from '@/share/InterfaceTypes';
import ENSLAVED_FILTER_MENU from '@/utils/flatfiles/enslaved_filter_menu.json';
import AFRICAN_FILTER_MENU from '@/utils/flatfiles/african_origins_filter_menu.json';
import TEXAS_FILTER_MENU from '@/utils/flatfiles/texas_filter_menu.json';
import ENSLAVERS_FILTER_MENU from '@/utils/flatfiles/enslavers_filter_menu.json'
const initialState: InitialStateFilterPeopleMenu = {
    value: {
        valueEnslaved: ENSLAVED_FILTER_MENU,
        valueAfricanOrigin: AFRICAN_FILTER_MENU,
        valueTexas: TEXAS_FILTER_MENU,
        valueEnslavers: ENSLAVERS_FILTER_MENU
    }
};
export const getFilterPeopleObjectSlice = createSlice({
    name: 'getFilterPeopleObject',
    initialState,
    reducers: {
        getFilterPeopleObject: (state, action: PayloadAction<ValuePeopleFilter>) => {
            state.value = action.payload;
        }
    }
})

export const { getFilterPeopleObject } = getFilterPeopleObjectSlice.actions;
export default getFilterPeopleObjectSlice.reducer;