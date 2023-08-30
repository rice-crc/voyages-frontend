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
    origin?: number
    "post-disembarkation"?: number;
}
export interface Edges {
    disposition?: Dispositions[]
    origination?: Originations[]
    transportation: Transportation[]

}
export interface Dispositions {
    s: string
    t: string
    w: number
}
export interface Originations {
    s: string
    t: string
    w: number
}
export interface Transportation {
    s: string
    t: string
    w: number
}

export interface PathOptions {
    color: string
}

export interface PolylineMapProps {
    transportation: Transportation[];
    disposition?: Dispositions[];
    origination?: Originations[]
    nodesData: NodeAggroutes[];
}

export interface NodeMarkerMapProps {
    nodesData: NodeAggroutes[];
}

export interface InitialStateNodeEdgesAggroutesMapData {
    nodesData: NodeAggroutes[],
    transportation: Transportation[],
    disposition?: Dispositions[],
    origination?: Originations[]
}