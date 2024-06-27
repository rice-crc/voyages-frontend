import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { InitialStateFilterMenuProps, ValueFilterList } from '@/share/InterfaceTypes';
import TRNSASLATIC_FILTR_MENU from '@/utils/flatfiles/voyages/voyages_transatlantic_filter_menu.json'
import INTRAAMERICAN_MENU from '@/utils/flatfiles/voyages/voyages_intraamerican_filter_menu.json'
import ALLVOYAGES_FILTR_MENU from '@/utils/flatfiles/voyages/voyages_all_filter_menu.json'
import ENSLAVED_FILTER_MENU from '@/utils/flatfiles/enslaved/enslaved_all_filter_menu.json';
import AFRICAN_FILTER_MENU from '@/utils/flatfiles/enslaved/enslaved_african_origins_filter_menu.json';
import TEXAS_FILTER_MENU from '@/utils/flatfiles/enslaved/enslaved_texas_filter_menu.json';
import ENSLAVERS_FILTER_MENU from '@/utils/flatfiles/enslavers/enslavers_filter_menu.json'
const initialState: InitialStateFilterMenuProps = {
    filterValueList: {
        valueTransaslantic: TRNSASLATIC_FILTR_MENU as any,
        valueIntraamerican: INTRAAMERICAN_MENU as any,
        valueAllVoyages: ALLVOYAGES_FILTR_MENU as any,
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