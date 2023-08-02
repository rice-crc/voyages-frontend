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

export interface InitialStateBlogProps {
    data: BlogDataProps[],
    post: BlogDataProps
    // title: string,
    // authors: Authors[],
    // tags: Tags[],
    // language: string
    // subtitle?: string
    // slug: string
    // updated_on: string
    // content: string
    // created_on: string
    // thumbnail: string
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
    }
}