
export interface PeopleColectionProps {
    headers: PeopleCollectionHeaders
    base_filter: PeopleCollectionBaseFilter[]
    filter_menu_flatfile: string
    table_flatfile: string
    style_name: string
    blocks: string[]
}

export interface PeopleCollectionHeaders {
    label: string
    text_introduce: string
}

export interface PeopleCollectionBaseFilter {
    var_name: string
    value: any[]
}
