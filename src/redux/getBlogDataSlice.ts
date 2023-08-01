
import { BlogDataProps, InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'


export const getBlogDataSlice = createSlice({
    name: 'getBlogSlice',
    initialState: InitialStateBlogProps,
    reducers: {
        setBlogData: (state, action: PayloadAction<BlogDataProps[]>) => {
            state.data = action.payload;
        },
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
    },
});

export const { setTitle, setBlogData } = getBlogDataSlice.actions;

export default getBlogDataSlice.reducer;
