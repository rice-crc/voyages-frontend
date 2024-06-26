import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { InitialStateFilterMenuProps, ValueFilterList } from '@/share/InterfaceTypes';
import VOYAGES_FILTR_MENU from '@/utils/flatfiles/voyages/transatlantic_voyages_filter_menu.json'
import ENSLAVED_FILTER_MENU from '@/utils/flatfiles/enslaved/enslaved_filter_menu.json';
import AFRICAN_FILTER_MENU from '@/utils/flatfiles/enslaved/african_origins_filter_menu.json';
import TEXAS_FILTER_MENU from '@/utils/flatfiles/voyages/texas_filter_menu.json';
import ENSLAVERS_FILTER_MENU from '@/utils/flatfiles/enslavers/enslavers_filter_menu.json'
const initialState: InitialStateFilterMenuProps = {
    filterValueList: {
        valueVoyages: VOYAGES_FILTR_MENU as any,
        valueEnslaved: ENSLAVED_FILTER_MENU as any,
        valueAfricanOrigin: AFRICAN_FILTER_MENU as any,
        valueEnslavedTexas: TEXAS_FILTER_MENU as any,
        valueEnslavers: ENSLAVERS_FILTER_MENU as any
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