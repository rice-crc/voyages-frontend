
import { Authors, BlogDataProps, InitialStateBlogProps, Tags } from '@/share/InterfaceTypesBlog';
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
        // setTitle: (state, action: PayloadAction<string>) => {
        //     state.title = action.payload;
        // },
        // setAuthors: (state, action: PayloadAction<Authors[]>) => {
        //     state.authors = action.payload;
        // },
        // setTags: (state, action: PayloadAction<Tags[]>) => {
        //     state.tags = action.payload;
        // },
        // setSubTitle: (state, action: PayloadAction<string>) => {
        //     state.subtitle = action.payload;
        // },
        // setLanguage: (state, action: PayloadAction<string>) => {
        //     state.language = action.payload;
        // },
        // setSlug: (state, action: PayloadAction<string>) => {
        //     state.slug = action.payload;
        // },
        // setUpdateOn: (state, action: PayloadAction<string>) => {
        //     state.updated_on = action.payload;
        // },
        // setCreateOn: (state, action: PayloadAction<string>) => {
        //     state.created_on = action.payload;
        // },
        // setContent: (state, action: PayloadAction<string>) => {
        //     state.content = action.payload;
        // },
        // setThumbnail: (state, action: PayloadAction<string>) => {
        //     state.thumbnail = action.payload;
        // },
    },
});

export const { setBlogData, setBlogPost } = getBlogDataSlice.actions;

export default getBlogDataSlice.reducer;
