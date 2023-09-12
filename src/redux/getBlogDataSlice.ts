
import { Author, BlogDataProps, InitialStateBlog, InstitutionAuthor, InstitutionAuthorProps, Post, ResultAutoList } from '@/share/InterfaceTypesBlog';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getBlogDataSlice = createSlice({
    name: 'getBlogSlice',
    initialState: InitialStateBlog,
    reducers: {
        setBlogData: (state, action: PayloadAction<BlogDataProps[]>) => {
            state.data = action.payload;
        },
        setBlogPost: (state, action: PayloadAction<BlogDataProps>) => {
            state.post = action.payload;
        },
        setSearchAutoKey:
            (state, action: PayloadAction<string>) => {
                state.searchAutoKey = action.payload;
            },
        setSearchAutoValue:
            (state, action: PayloadAction<string>) => {
                state.searchAutoValue = action.payload;
            },
        setSearchBlogTitle: (state, action: PayloadAction<string>) => {
            state.searchTitle = action.payload;
        },
        setBlogAutoLists: (state, action: PayloadAction<ResultAutoList[]>) => {
            state.blogAutoLists = action.payload;
        },
        setAuthorData: (state, action: PayloadAction<Author>) => {
            state.author = action.payload;
        },
        setAuthorPost:
            (state, action: PayloadAction<Post[]>) => {
                state.authorPost = action.payload;
            },
        setInstitutionAuthorsData:
            (state, action: PayloadAction<InstitutionAuthorProps>) => {
                state.institutionData = action.payload;
            },
        setInstitutionAuthorsList:
            (state, action: PayloadAction<InstitutionAuthor[]>) => {
                state.institutionList = action.payload;
            },

    },
});

export const { setBlogData, setBlogPost, setBlogAutoLists, setSearchAutoKey, setSearchAutoValue, setSearchBlogTitle, setAuthorData, setAuthorPost, setInstitutionAuthorsData, setInstitutionAuthorsList } = getBlogDataSlice.actions;

export default getBlogDataSlice.reducer;
