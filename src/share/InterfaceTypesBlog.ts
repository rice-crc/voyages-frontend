export interface BlogDataProps {
    id: number
    authors: Author[]
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
export interface InstitutionProps {
    id: number
    name: string
    description: string
    slug: string
    image: string
}
export interface Author {
    id: number
    posts: Post[]
    photo: string
    name: string
    description: any
    slug: string
    role: string
    institution: InstitutionProps
}

export interface Tags {
    id: number
    name: string
    slug: string
    intro: string
}

export interface Post {
    id: number
    tags: Tags[]
    thumbnail: string
    title: string
    language: string
    subtitle?: string
    slug: string
    updated_on: string
    content: string
    created_on: string
    status: number
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
    author: Author
    authorPost: Post[]
    institutionData: InstitutionAuthorProps
    institutionList: InstitutionAuthor[]

}
export const InitialStateBlog: InitialStateBlogProps = {
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
    blogAutoLists: [],
    author: {
        id: 0,
        posts: [],
        name: "",
        description: null,
        slug: "",
        role: "",
        photo: "",
        institution: {
            "id": 0,
            "name": "",
            "description": "",
            "slug": "",
            "image": ""
        },
    },
    authorPost: [],
    institutionData: {
        id: 0,
        institution_authors: [],
        name: "",
        description: "",
        slug: "",
        image: ""
    },
    institutionList: []
}

export interface BlogAutoCompletedProps {
    totalResultsCount: number
    results: ResultAutoList[]
}

export interface ResultAutoList {
    id: number
    label: string
}


export interface InstitutionAuthorProps {
    id: number
    institution_authors: InstitutionAuthor[]
    name: string
    description: string
    slug: string
    image: string
}

export interface InstitutionAuthor {
    id: number
    posts: Post[]
    photo: string
    institution: Institution
    name: string
    description?: string
    slug: string
    role: string
}

export interface Post {
    id: number
    tags: Tag[]
    thumbnail: string
    title: string
    language: string
    subtitle?: string
    slug: string
    updated_on: string
    content: string
    created_on: string
    status: number
}

export interface Tag {
    id: number
    name: string
    slug: string
    intro: string
}

export interface Institution {
    id: number
    name: string
    description: string
    slug: string
    image: string
}
