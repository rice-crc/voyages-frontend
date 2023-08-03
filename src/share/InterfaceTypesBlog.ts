export interface BlogDataProps {
    id: number
    authors: Authors[]
    tags: Tags[]
    title: string
    language: string
    subtitle?: string
    slug: string
    updated_on: string
    content: string
    created_on: string
    status: number
    thumbnail: string
}

export interface Authors {
    id: number
    name: string
    description?: string
    slug: string
    role: string
    photo: string
    institution: number
}

export interface Tags {
    id: number
    name: string
    slug: string
    intro: string
}
export interface SearchBlogProps {
    search: string
    tag: string
    title: string
}
export const SearchBlogData: SearchBlogProps[] = [
    { search: 'Tags Name', tag: 'tags__name', title: 'tags' },
    { search: 'Authors Name', tag: 'authors__name', title: 'authors' },
    { search: 'Title', tag: 'title', title: 'title' },
]


export interface InitialStateBlogProps {
    data: BlogDataProps[]
    post: BlogDataProps
    searchTitle: string
    searchAutoKey: string
    searchAutoValue: string
    blogAutoLists: ResultAutoList[]
}
export const InitialStateBlogProps: InitialStateBlogProps = {
    data: [],
    post: {
        id: 0,
        authors: [],
        tags: [],
        title: '',
        language: '',
        subtitle: '',
        slug: '',
        updated_on: '',
        content: '',
        created_on: '',
        status: 0,
        thumbnail: ''
    },
    searchTitle: 'tags',
    searchAutoKey: 'tags__name',
    searchAutoValue: '',
    blogAutoLists: []

}

export interface BlogAutoCompletedProps {
    totalResultsCount: number
    results: ResultAutoList[]
}

export interface ResultAutoList {
    id: number
    label: string
}
