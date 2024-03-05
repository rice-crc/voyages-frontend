import { createRef, useLayoutEffect, useRef, useState } from "react"
import { LeafletMap } from "./LeafletMap"
import { useMap } from "react-leaflet"
import { LatLngBounds } from "leaflet"

// TODO: move out the basic geometry/calculation stuff to a separate file.

export type LatLngPathPointDeg = [lat: number, lng: number]
export type LatLngPathPointRad = [lat: number, lng: number]

const degToRad = Math.PI / 180.0
const radToDeg = 180.0 / Math.PI

const convertToDeg = (pt: LatLngPathPointRad): LatLngPathPointDeg => {
    const [lat, lng] = pt
    return [lat * radToDeg, lng * radToDeg]
}

const convertToRadians = (pt: LatLngPathPointDeg): LatLngPathPointRad => {
    const [lat, lng] = pt
    return [lat * degToRad, lng * degToRad]
}

export interface GreatCircle {
    start: LatLngPathPointRad
    end: LatLngPathPointRad
    centralAngle: number
}

/**
 * Obtain the point along the arc that corresponds to a fraction t \in [0, 1] of
 * the total arc.
 */
export const arcInterpolate = (arc: GreatCircle, t: number): LatLngPathPointRad => {
    const { start: [sx, sy], end: [ex, ey], centralAngle: g } = arc
    const A = Math.sin((1 - t) * g) / Math.sin(g);
    const B = Math.sin(t * g) / Math.sin(g);
    const x = A * Math.cos(sy) * Math.cos(sx) + B * Math.cos(ey) * Math.cos(ex);
    const y = A * Math.cos(sy) * Math.sin(sx) + B * Math.cos(ey) * Math.sin(ex);
    const z = A * Math.sin(sy) + B * Math.sin(ey);
    const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    const lng = Math.atan2(y, x);
    return [lat, lng]
}

/**
 * Computes the central angle of a great circle. In the very exceptional case of
 * antipodal points or numerical errors, an exception is thrown.
 */
export const greatCircle = (start: LatLngPathPointDeg, end: LatLngPathPointDeg): GreatCircle => {
    const [sx, sy] = convertToRadians(start)
    const [ex, ey] = convertToRadians(end)
    const w = sx - ex
    const h = sy - ey
    // https://en.wikipedia.org/wiki/Haversine_formula
    var z = Math.pow(Math.sin(h / 2.0), 2) +
        Math.cos(sy) *
        Math.cos(ey) *
        Math.pow(Math.sin(w / 2.0), 2)
    const centralAngle = 2.0 * Math.asin(Math.sqrt(z))
    if (centralAngle === Math.PI || isNaN(centralAngle)) {
        throw Error('Failed to calculate the great circle central angle')
    }
    return { start: [sx, sy], end: [ex, ey], centralAngle }
}

export type InterpolatedRoute = (time: number) => LatLngPathPointRad

class Route {
    private readonly _totalAngle: number
    private readonly _arcs: ReadonlyArray<GreatCircle>

    constructor(points: LatLngPathPointDeg[]) {
        const arcs = []
        let totalAngle = 0.0
        for (let i = 0; i < points.length - 1; ++i) {
            const arc = greatCircle(points[i], points[i + 1])
            arcs.push(arc)
            totalAngle += arc.centralAngle
        }
        this._arcs = arcs
        this._totalAngle = totalAngle
    }

    /** 
     * Use the approximate Earth radius to compute the total length of the route.
     */
    getLength = () => this._totalAngle * 6371

    /**
     * Creates an interpolated route with a maximum perturbation in the latitude
     * and longitude of the points.
     */
    createInterpolation = (perturbLat: number, perturbLng: number): InterpolatedRoute => {
        // The interpolation works by first identifying which arc contains the
        // interpolated point. This is obtained by the prefix sum of the arc
        // lengths. 
        //
        // The expected use case of the interpolation function is to be invoked
        // monotonically (e.g. f(t_1), f(t_2), ... with t_1 < t_2 < ...). We
        // optimize for this use case by creating a capture of the last arc
        // taken and starting the search from there. If this needs to change,
        // then it would be better to precompute the prefix sums and do a binary
        // search every time.
        let capture = { idxArc: 0, accAngle: 0.0, time: 0 }
        const initial = capture
        return time => {
            if (time < capture.time) {
                // The search has to start from zero now.
                capture = initial
            }
            const targetAngle = time * this._totalAngle
            while (capture.idxArc < this._arcs.length - 1 &&
                capture.accAngle + this._arcs[capture.idxArc].centralAngle < targetAngle) {
                capture.accAngle += this._arcs[capture.idxArc].centralAngle
                ++capture.idxArc
            }
            const arc = this._arcs[capture.idxArc]
            const [lat, lng] = arcInterpolate(
                arc,
                (targetAngle - capture.accAngle) / arc.centralAngle)
            // Apply a perturbation to the path that is smaller at the beginning
            // and at the end of the path and maximum at the middle.
            const fuzzy = time * (1.0 - time)
            return [lat + fuzzy * perturbLat, lng + fuzzy * perturbLng]
        }
    }
}

class VoyageRoute {
    constructor(
        public readonly id: number,
        public readonly startTime: number,
        public readonly endTime: number,
        public readonly numberEmbarked: number,
        public readonly numberDisembarked: number,
        public readonly route: InterpolatedRoute) {
    }
}

class VoyageRouteCollection {
    readonly voyageRoutes: ReadonlyArray<VoyageRoute>

    constructor(voyageRoutes: VoyageRoute[]) {
        // Enforce sorting to allow quickly determining the active voyages at
        // any given time.
        this.voyageRoutes = [...voyageRoutes].sort((a, b) => a.startTime - b.startTime)
        // Create a capture for the start index of the search to accelerate
        // monotonic sequential calls.
        if (this.voyageRoutes.length === 0) {
            this.getActive = () => []
        } else {
            let idxStart = 0;
            this.getActive = function*(time: number) {
                if (time < this.voyageRoutes[idxStart].startTime) {
                    // Reset start
                    idxStart = 0
                }
                const n = this.voyageRoutes.length
                for (let i = idxStart; i < n; ++i) {
                    const v = this.voyageRoutes[i]
                    if (v.startTime > time) {
                        // Since the voyages are sorted, we are done iterating.
                        break
                    }
                    if (v.endTime > time) {
                        yield v
                    } else if (i === idxStart) {
                        // Advance the start index: any subsequent call with a
                        // larger time value can safely skip the current voyage.
                        ++idxStart
                    }
                }
            }
        }
    }

    getActive: (time: number) => Iterable<VoyageRoute>
}

export interface VoyageRouteRenderStyles {
    styles: string[]
    getRadiusForVoyage: (voyage: VoyageRoute) => number
    getStyleForVoyage: (voyage: VoyageRoute) => number
}

// The route data is segmented 
export interface TimelapseRouteData {
    names: string[]

}

interface CanvasAnimationProps {
    collection: VoyageRouteCollection
    speed: number
    renderStyles: VoyageRouteRenderStyles
}

interface VoyageRoutePoint {
    voyage: VoyageRoute
    pt: LatLngPathPointDeg
}

const buffer: (VoyageRoutePoint | null)[] = new Array(2048)

function* _createStyleIterable(blockStart: number, count: number): Iterable<VoyageRoutePoint> {
    const blockEnd = blockStart + count
    for (let i = blockStart; i < blockEnd; ++i) {
        yield buffer[i]!
    }
}

/**
 * This is a performance oriented, limited-capacity group-by. Yielded groups are
 * clustered by style, but the same style may be yielded multiple times if the
 * block capacity is reached. Allocation is kept to a minimum by reusing the
 * buffer array and using Iterables.
 */
function* _groupByStyle(renderStyles: VoyageRouteRenderStyles, collection: VoyageRouteCollection, time: number, bounds: LatLngBounds) {
    if (renderStyles.styles.length > buffer.length) {
        throw Error('No way you need so many styles??')
    }
    const counts = renderStyles.styles.map(_ => 0)
    const blockSize = buffer.length / counts.length
    const source = collection.getActive(time)
    for (const voyage of source) {
        const idx = renderStyles.getStyleForVoyage(voyage)
        const blockStart = idx * blockSize
        const pt = convertToDeg(voyage.route(time))
        if (!bounds.contains(pt)) {
            // Skip points that do not show up inside the bounds.
            continue
        }
        buffer[blockSize + counts[idx]++] = { voyage, pt }
        if (counts[idx] === blockSize) {
            // A block is full, yield them all and clear the block.
            yield { style: renderStyles.styles[idx], voyages: _createStyleIterable(blockStart, blockSize) }
            counts[idx] = 0
        }
    }
    for (let idx = 0; idx < counts.length; ++idx) {
        if (counts[idx] === 0) {
            continue
        }
        const blockStart = idx * blockSize
        yield { style: renderStyles.styles[idx], voyages: _createStyleIterable(blockStart, counts[idx]) }
    }
}

const CanvasAnimation = ({ collection, renderStyles, speed }: CanvasAnimationProps) => {
    const canvasRef = createRef<HTMLCanvasElement>()
    const timeRef = useRef<number>(0)
    const map = useMap()
    const render = (elapsed: number) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx || !canvas) {
            return
        }
        // Clear canvas before rendering frame.
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const bounds = map.getBounds()
        const time = (timeRef.current += elapsed) * speed
        // We are grouping the work so that Canvas draw operations are batched
        // (e.g. we draw several circles with the same style in one step). Our
        // grouping method also skips over points that would be outside the map
        // bounds.
        const active = _groupByStyle(renderStyles, collection, time, bounds)
        for (const { style, voyages } of active) {
            ctx.beginPath()
            ctx.fillStyle = style
            for (const { voyage, pt } of voyages) {
                const radius = renderStyles.getRadiusForVoyage(voyage)
                const { x, y } = map.latLngToContainerPoint(pt)
                // Start a new sub-path with moveTo.
                ctx.moveTo(x + radius, y);
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
            }
            ctx.fill()
        }
    }
    // Handle the frame requests.
    const fRef = useRef<number>(0)
    const lastTick = useRef<DOMHighResTimeStamp>(0)
    const frame = (now: DOMHighResTimeStamp) => {
        const elapsed = lastTick.current ? (now - lastTick.current) : 0
        lastTick.current = now
        fRef.current = requestAnimationFrame(frame)
        // Request next frame.
        render(elapsed)
    }
    useLayoutEffect(() => {
        fRef.current = requestAnimationFrame(frame)
        return () => { fRef.current && cancelAnimationFrame(fRef.current) }
    }, [collection, renderStyles, speed])
    return <canvas ref={canvasRef} />
}

const InteractiveVoyageRoutesFrame = () => {
    // TODO: when paused, we should render every voyage as an SVG element that
    // is interactive.
    return <></>
}

export interface TimelapseMapProps {
    renderStyles: VoyageRouteRenderStyles
    collection: VoyageRouteCollection
    initialSpeed: number
    minSpeed: number
    maxSpeed: number
}

export const TimelapseMap = ({ collection, initialSpeed, renderStyles }: TimelapseMapProps) => {
    const [zoomLevel, setZoomLevel] = useState<number>(3)
    const [isPaused, setPaused] = useState(false)
    const [speed, setSpeed] = useState(initialSpeed)
    return <LeafletMap zoomLevel={zoomLevel} setZoomLevel={setZoomLevel}>
        {!isPaused && <CanvasAnimation collection={collection} speed={speed} renderStyles={renderStyles} />}
        {isPaused && <InteractiveVoyageRoutesFrame />}
    </LeafletMap>
}