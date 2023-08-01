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
    title: string,
    authors: string[],
    tags: string[],
}
export const InitialStateBlogProps: InitialStateBlogProps = {
    data: [],
    title: '',
    authors: [],
    tags: [],
}