import { configureStore } from "@reduxjs/toolkit";
import getOptions from './opptionsDataSlice'
import getRangeSlider from './getRangeSliderSlice'
import {voyagesApi} from '../fetchAPI/fetchApiService'

const store = configureStore({
    reducer: {
        getOptions, 
        getRangeSlider,
        [voyagesApi.reducerPath]: voyagesApi.reducer
    }, 
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(voyagesApi.middleware)
})
export default store;