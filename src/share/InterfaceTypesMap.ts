export interface NodeAggroutes {
    data: DataAggroutes
    id: string
    weights: Weights
}

export interface DataAggroutes {
    lat?: number
    lon?: number
    name?: string
    uuid?: string
    val?: number
    tags?: string[]
}

export interface Weights {
    disembarkation: number
    embarkation: number
}
export interface Edges {
    disposition?: Disposition[]
    origination?: Origination[]
    transportation: Transportation[]

}
export interface Disposition {
    s: string
    t: string
    w: number
}
export interface Origination {
    s: string
    t: string
    w: number
}
export interface Transportation {
    s: string
    t: string
    w: number
} //