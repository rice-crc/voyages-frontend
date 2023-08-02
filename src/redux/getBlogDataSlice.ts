
import { BlogDataProps, InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getBlogDataSlice = createSlice({
    name: 'getBlogSlice',
    initialState: InitialStateBlogProps,
    reducers: {
        setBlogData: (state, action: PayloadAction<BlogDataProps[]>) => {
            state.data = action.payload;
        },
        setBlogPost: (state, action: PayloadAction<BlogDataProps>) => {
            state.post = action.payload;
        },
        setSearchBlogByValue:
            (state, action: PayloadAction<string>) => {
                state.searchValue = action.payload;
            },
        setSearchBlogTitle: (state, action: PayloadAction<string>) => {
            state.searchTitle = action.payload;
        },
    },
});

export const { setBlogData, setBlogPost, setSearchBlogByValue, setSearchBlogTitle } = getBlogDataSlice.actions;

export default getBlogDataSlice.reducer;
