import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { InitialStateFilterMenuProps, ValueFilterList } from '@/share/InterfaceTypes';
import VOYAGES_FILTR_MENU from '@/utils/flatfiles/transatlantic_voyages_filter_menu.json'
import ENSLAVED_FILTER_MENU from '@/utils/flatfiles/enslaved_filter_menu.json';
import AFRICAN_FILTER_MENU from '@/utils/flatfiles/african_origins_filter_menu.json';
import TEXAS_FILTER_MENU from '@/utils/flatfiles/texas_filter_menu.json';
import ENSLAVERS_FILTER_MENU from '@/utils/flatfiles/enslavers_filter_menu.json'
const initialState: InitialStateFilterMenuProps = {
    filterValueList: {
        valueVoyages: VOYAGES_FILTR_MENU,
        // valueEnslaved: ENSLAVED_FILTER_MENU,
        // valueAfricanOrigin: AFRICAN_FILTER_MENU,
        // valueEnslavedTexas: TEXAS_FILTER_MENU,
        // valueEnslavers: ENSLAVERS_FILTER_MENU
    }
};
export const getFilterMenuListSlice = createSlice({
    name: 'getFilterMenuListSlice',
    initialState,
    reducers: {
        setFilterMenuList: (state, action: PayloadAction<ValueFilterList>) => {
            state.filterValueList = action.payload;
        },
        resetSlice: (state) => initialState,
    }
})

export const { setFilterMenuList, resetSlice } = getFilterMenuListSlice.actions;
export default getFilterMenuListSlice.reducer;