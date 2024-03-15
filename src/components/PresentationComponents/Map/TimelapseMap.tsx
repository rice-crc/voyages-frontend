import { createRef, useEffect, useLayoutEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, LayersControl, useMap, SVGOverlay } from 'react-leaflet';
import { LatLngBounds } from "leaflet"
import { AUTHTOKEN, BASEURL } from '../../../share/AUTH_BASEURL';
import OBSOLETE_regionalSegments from './regional.json'
import OBSOLETE_voyages from './voyages.json'
import {
    MAP_CENTER,
    MAXIMUM_ZOOM,
    MINIMUM_ZOOM,
    mappingSpecialists,
    mappingSpecialistsCountries,
    mappingSpecialistsRivers
} from '@/share/CONST_DATA';
import { HandleZoomEvent } from "./HandleZoomEvent";

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
    const { start: [slat, slng], end: [elat, elng], centralAngle: g } = arc
    const A = Math.sin((1 - t) * g) / Math.sin(g);
    const B = Math.sin(t * g) / Math.sin(g);
    const x = A * Math.cos(slng) * Math.cos(slat) + B * Math.cos(elng) * Math.cos(elat);
    const y = A * Math.cos(slng) * Math.sin(slat) + B * Math.cos(elng) * Math.sin(elat);
    const z = A * Math.sin(slng) + B * Math.sin(elng);
    const lng = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    const lat = Math.atan2(y, x);
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

type Point2D = [x: number, y: number]

const sum = (a: Point2D, b: Point2D, bScalar = 1): Point2D =>
    [a[0] + bScalar * b[0], a[1] + bScalar * b[1]]

const dotProd = (a: Point2D, b: Point2D) =>
    a[0] * b[0] + a[1] * b[1]

const normSq = (a: Point2D) => dotProd(a, a)

class AngleInfo {
    public readonly delta1: Point2D
    public readonly delta2: Point2D
    public readonly angle: number

    constructor(
        public readonly center: Point2D,
        public readonly pt1: Point2D,
        public readonly pt2: Point2D) {
        const [cx, cy] = center
        const [pt1x, pt1y] = pt1
        const [pt2x, pt2y] = pt2
        this.delta1 = [pt1x - cx, pt1y - cy]
        this.delta2 = [pt2x - cx, pt2y - cy]
        const n1 = normSq(this.delta1)
        const n2 = normSq(this.delta2)
        const sqrtDeltasProduct = Math.sqrt(n1 * n2)
        const dot = dotProd(this.delta1, this.delta2)
        this.angle = Math.acos(dot / sqrtDeltasProduct)
    }
}

interface SharpCornerReductionArgs {
    point: Point2D,
    path: Point2D[]
    reversed: boolean
    maxFractionRemoved?: number
    angleThreshold?: number
}

/**
 * Construct a sequence that connects the given point to the path (in natural or
 * reversed orientation) by possibly jumping to a path point further from the
 * start/end to minimize sharp corners.
 */
const reduceSharpCorner = ({
    point,
    path,
    reversed,
    maxFractionRemoved = 0.25,
    angleThreshold = Math.PI * 0.15 }: SharpCornerReductionArgs) => {
    const last = path.length - 1
    const maxTries = Math.min(last, Math.round(path.length * maxFractionRemoved))
    let idxBest = reversed ? last : 0
    let bestAngle = Math.PI
    const step = reversed ? -1 : 1
    for (let i = 0; i < maxTries; ++i) {
        const idx = reversed ? last - i : i
        // Compute the angle with the center being the next point in the path
        // and the other two points being this candidate and the source point.
        // Example: "." represents the point and the path segments are below.
        // The algorithm should find the path's element marked with ! as the
        // first point of the path that has a small angle.
        //          .
        //            /
        //         !--
        //        /
        //       /
        //      |___
        const { angle } = new AngleInfo(path[idx + step], path[idx], point)
        if (angle <= angleThreshold) {
            // If we found an angle below threshold, stop going further along
            // the path since we want to preserve as much of the original as
            // possible.
            idxBest = idx
            break
        }
        if (angle < bestAngle) {
            // Keep track of the best angle found in case we never find one
            // lower than the threshold.
            idxBest = idx
            bestAngle = angle
        }
    }
    // Instead of taking a direct jump from the point to the path[idxBest], our
    // approach is to produce a smooth approximation.
    const angleInfo = new AngleInfo(path[idxBest + step], path[idxBest], point)
    const n1 = normSq(angleInfo.delta1)
    const n2 = normSq(angleInfo.delta2)
    const endTangentScalar = Math.sqrt(n1 * n2) / n2;
    const prefix: Point2D[] = new Array(9)
    for (let i = 0; i < prefix.length; ++i) {
        const scalar = (i + 1) / (prefix.length + 1)
        const v1 = sum(angleInfo.center, angleInfo.delta1, scalar)
        const v2 = sum(angleInfo.center, angleInfo.delta2, scalar * endTangentScalar)
        const d = sum(v1, v2, -1) // d = v1 - v2
        // Using a quadratic scaling: pt = v2 + s^2 * (v1 - v2)
        const pt = sum(v2, d, scalar * scalar)
        prefix[reversed ? i : prefix.length - 1 - i] = pt
    }
    return reversed
        ? [...path.slice(0, idxBest), ...prefix]
        : [...prefix, ...path.slice(idxBest + 1)]
}

export type InterpolatedPath = (time: number) => LatLngPathPointRad

class MapRoute {
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

    isValid = () => this._arcs.length > 0

    /**
     * Creates an interpolated route with a maximum perturbation in the latitude
     * and longitude of the points.
     */
    createInterpolation = (perturbLat: number, perturbLng: number): InterpolatedPath => {
        if (this._arcs.length === 0) {
            return _ => [0, 0]
        }
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
        const initial = { ...capture }
        return time => {
            if (time < capture.time) {
                // The search has to start from zero now.
                capture = { ...initial }
            }
            const targetAngle = time * this._totalAngle
            while (capture.idxArc < this._arcs.length - 1 &&
                capture.accAngle + this._arcs[capture.idxArc].centralAngle < targetAngle) {
                capture.time = time
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

interface PortData {
    reg: number
    path: LatLngPathPointDeg[]
    name: string
}

interface PortCollectionData {
    src: Record<string, PortData>
    dst: Record<string, PortData>
}

type RegionSegments = Record<string, Record<string, LatLngPathPointDeg[]>>

class MapRouteBuilder {
    private readonly cache: Record<string, MapRoute> = {}

    private static readonly invalidRoute = new MapRoute([])

    constructor(
        readonly ports: PortCollectionData,
        readonly regionSegments: RegionSegments) {
    }

    getRoute = (source: number, destination: number) => {
        const key = `${source}_${destination}`
        if (this.cache[key]) {
            return this.cache[key]
        }
        // Compile route based on three segments.
        const srcPort = this.ports.src[source]
        const dstPort = this.ports.dst[destination]
        if (!srcPort?.path || !dstPort?.path ||
            !this.regionSegments[srcPort.reg] ||
            !this.regionSegments[srcPort.reg][dstPort.reg]) {
            return this.cache[key] = MapRouteBuilder.invalidRoute
        }
        const first = srcPort.path
        let second = this.regionSegments[srcPort.reg][dstPort.reg]
        let third = dstPort.path
        if (first.length === 1) {
            second = reduceSharpCorner({
                point: first[0],
                path: second,
                reversed: false
            })
        }
        if (third.length === 1) {
            second = reduceSharpCorner({
                point: third[0],
                path: second,
                reversed: true
            })
        }
        third = [...third].reverse()
        const path = [...first, ...second, ...third]
        return this.cache[key] = new MapRoute(path)
    }
}

interface VoyageRoute {
    readonly id: number
    readonly startTime: number
    readonly animationDuration: number
    readonly embarked: number
    readonly disembarked: number
    route: MapRoute
}

type InterpolatedVoyageRoute = VoyageRoute & { interpolatedPath: InterpolatedPath }

class VoyageRouteCollection {
    readonly voyageRoutes: ReadonlyArray<InterpolatedVoyageRoute>

    constructor(voyageRoutes: VoyageRoute[], maxLatPerturb: number, maxLngPerturb: number) {
        // Enforce sorting by startTime, immutability, and generate randomly
        // perturbed interpolated paths for each voyage.
        this.voyageRoutes = voyageRoutes
            .filter(v => v.route.isValid())
            .map(v => ({
                ...v, interpolatedPath: v.route.createInterpolation(
                    maxLatPerturb * (Math.random() - 0.5),
                    maxLngPerturb * (Math.random() - 0.5))
            }))
            .sort((a, b) => a.startTime - b.startTime)
    }
}

interface VoyageRoutePoint {
    readonly voyage: VoyageRoute
    readonly pt: LatLngPathPointDeg
}

interface VoyageRoutesCluster {
    readonly style: string
    readonly voyages: Iterable<VoyageRoutePoint>
}

class VoyageRouteCollectionWindow {
    private readonly vs: ReadonlyArray<InterpolatedVoyageRoute>
    private readonly time: number
    private idxSearch: number

    private static buffer: (VoyageRoutePoint | null)[] = new Array(2048)

    constructor(
        voyageRoutes: ReadonlyArray<InterpolatedVoyageRoute>,
        private readonly speed: number,
        time?: number,
        idxSearch?: number) {
        this.vs = voyageRoutes
        this.time = time ?? (this.vs.length === 0 ? 0 : this.vs[0].startTime)
        this.idxSearch = idxSearch ?? 0
    }

    static createStyleIterable = function* (blockStart: number, count: number): Iterable<VoyageRoutePoint> {
        const blockEnd = blockStart + count
        for (let i = blockStart; i < blockEnd; ++i) {
            yield VoyageRouteCollectionWindow.buffer[i]!
        }
    }

    advance = (delta: number) => new VoyageRouteCollectionWindow(this.vs, this.speed, this.time + delta, this.idxSearch)

    hasFinished = () => this.idxSearch >= this.vs.length

    year = () => Math.floor(this.time / 360)

    /**
     * This is a performance oriented, limited-capacity group-by. Yielded groups
     * are clustered by style, however, the same style may be yielded multiple
     * times if the block capacity is reached. Allocation is kept to a minimum
     * by reusing the buffer array and using Iterables.
     */
    groupByStyle = (renderStyles: VoyageRouteRenderStyles, bounds: LatLngBounds): Iterable<VoyageRoutesCluster> => {
        const generator = function* (self: VoyageRouteCollectionWindow) {
            const buffer = VoyageRouteCollectionWindow.buffer
            if (renderStyles.styles.length > buffer.length) {
                throw Error('No way you need so many styles??')
            }
            const counts = renderStyles.styles.map(_ => 0)
            const blockSize = Math.trunc(buffer.length / counts.length)
            const source = self.window()
            const creator = VoyageRouteCollectionWindow.createStyleIterable
            for (const voyage of source) {
                const idx = renderStyles.getStyleForVoyage(voyage)
                const blockStart = idx * blockSize
                const fraction = (self.time - voyage.startTime) / voyage.animationDuration
                const pt = convertToDeg(voyage.interpolatedPath(fraction))
                //if (!bounds.contains(pt)) {
                // Skip points that do not show up inside the bounds.
                //    continue
                //}
                buffer[blockStart + counts[idx]++] = { voyage, pt }
                if (counts[idx] === blockSize) {
                    // A block is full, yield them all and clear the block.
                    yield { style: renderStyles.styles[idx], voyages: creator(blockStart, blockSize) }
                    counts[idx] = 0
                }
            }
            // Now yield all the remaining clusters.
            for (let idx = 0; idx < counts.length; ++idx) {
                if (counts[idx] > 0) {
                    yield { style: renderStyles.styles[idx], voyages: creator(idx * blockSize, counts[idx]) }
                }
            }
        }
        return generator(this)
    }

    restart = () => new VoyageRouteCollectionWindow(this.vs, this.speed)

    window = (): Iterable<InterpolatedVoyageRoute> => {
        const self = this
        const generator = function* () {
            const { vs, time, speed } = self
            const n = vs.length
            for (let i = self.idxSearch; i < n; ++i) {
                const v = vs[i]
                if (v.startTime > time) {
                    // Since the voyages are sorted, we are done iterating.
                    break
                }
                if (v.startTime + v.animationDuration * speed > time) {
                    yield v
                } else if (i === self.idxSearch) {
                    // Note: we are updating our knowledge that no entry in the
                    // array before idxSearch is active in the window. This is
                    // the only mutable field in this class and serves for
                    // improved performance.
                    ++self.idxSearch
                }
            }
        }
        return generator()
    }
}

export interface VoyageRouteRenderStyles {
    readonly styles: readonly string[]
    getRadiusForVoyage: (voyage: VoyageRoute) => number
    getStyleForVoyage: (voyage: VoyageRoute) => number
}

interface CanvasAnimationProps {
    collection: VoyageRouteCollection
    speed: number
    renderStyles: VoyageRouteRenderStyles
    paused: boolean
    onWindowChange: (win: VoyageRouteCollectionWindow) => void
}

const useMapPosition = () => {
    const map = useMap()
    const getSizeOfMap = (m: L.Map): Size => {
        const { x: width, y: height } = m.getSize()
        return { width, height }
    }
    const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds())
    const [size, setSize] = useState(getSizeOfMap(map))
    useEffect(() => {
        const refreshBounds = () => setBounds(map.getBounds())
        map.on('dragend', refreshBounds)
        map.on('zoomend', refreshBounds)
        map.on('resize', () => setSize(getSizeOfMap(map)))
    }, [map])
    return { bounds, size }
}

const CanvasAnimation = ({ collection, paused, renderStyles, speed, onWindowChange }: CanvasAnimationProps) => {
    const windowRef = useRef<VoyageRouteCollectionWindow>()
    const canvasRef = useRef<CanvasRenderingContext2D | null>()
    const map = useMap()
    const { size } = useMapPosition()
    useEffect(
        () => {
            windowRef.current = new VoyageRouteCollectionWindow(
                collection.voyageRoutes,
                speed,
                1720 * 360)
        },
        [collection, speed])
    const render = (elapsed: number) => {
        const ctx = canvasRef.current
        let win = windowRef.current
        if (!ctx || !win) {
            return
        }
        // Advance the window.
        win = win.advance(elapsed * speed / 10)
        if (win.hasFinished()) {
            // Restart
            win = win.restart()
        }
        onWindowChange(win)
        windowRef.current = win
        // We are grouping the work so that Canvas draw operations are batched
        // (e.g. we draw several circles with the same style in one step). Our
        // grouping method also skips over points that would be outside the map
        // bounds.
        const bounds = map.getBounds()
        const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
        ctx.setTransform(1, 0, 0, 1, -topLeft.x, -topLeft.y);
        // Clear canvas before rendering frame.
        ctx.clearRect(topLeft.x, topLeft.y, ctx.canvas.width, ctx.canvas.height)
        if (paused) {
            // This is the right point to stop when paused: after clearing,
            // before drawing.
            return
        }
        const active = win.groupByStyle(renderStyles, bounds)
        for (const { style, voyages } of active) {
            ctx.beginPath()
            ctx.fillStyle = style
            for (const { voyage, pt } of voyages) {
                const radius = renderStyles.getRadiusForVoyage(voyage)
                const { x, y } = map.latLngToLayerPoint(pt)
                // Start a new sub-path with moveTo.
                ctx.moveTo(x + radius, y);
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
            }
            ctx.fill()
        }
    }
    // Handle the animation frame requests.
    const fRef = useRef<number>(0)
    const lastTick = useRef<DOMHighResTimeStamp>(0)
    useLayoutEffect(() => {
        const frame = (now: DOMHighResTimeStamp) => {
            const elapsed = lastTick.current ? (now - lastTick.current) : 0
            if (paused) {
                // Reset the last tick so that when the animation resumes, no
                // time would have elapsed.
                lastTick.current = 0
            } else {
                // Request next frame and render current.
                lastTick.current = now
                fRef.current = requestAnimationFrame(frame)
            }
            render(elapsed)
        }
        fRef.current = requestAnimationFrame(frame)
        return () => { fRef.current && cancelAnimationFrame(fRef.current) }
    }, [collection, renderStyles, speed, paused, map])
    return <canvas width={size.width} height={size.height}
        style={{ pointerEvents: 'none', position: 'relative', zIndex: 5000 }}
        ref={c => canvasRef.current = c?.getContext('2d')} />
}

interface InteractiveShipProps {
    voyage: VoyageRoute
    pt: Point2D
    radius: number
    color: string
    isSelected: boolean
    onClick: (voyage: VoyageRoute) => void
    onHover: (voyage: VoyageRoute) => void
}

const InteractiveShip = ({ voyage, pt, radius, color, isSelected, onClick, onHover }: InteractiveShipProps) => {
    return <g onClick={() => onClick(voyage)} onMouseOver={() => onHover(voyage)}>
        <circle r={radius} cx={pt[0]} cy={pt[1]} fill={color} />
        <circle
            opacity={isSelected ? 1 : 0}
            r={Math.max(10, 5 + radius)} cx={pt[0]} cy={pt[1]} stroke="gray" strokeWidth={2} fill="transparent" />
    </g>
}

interface InteractiveVoyageRoutesFrameProps {
    window: VoyageRouteCollectionWindow
    renderStyles: VoyageRouteRenderStyles
}

const InteractiveVoyageRoutesFrame = ({ window, renderStyles }: InteractiveVoyageRoutesFrameProps) => {
    // TODO: when paused, we should render every voyage as an SVG element that
    // is interactive.
    const [selected, setSelected] = useState<VoyageRoute | null>(null)
    const map = useMap()
    const { bounds } = useMapPosition()
    const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
    const active = window.groupByStyle(renderStyles, bounds)
    const children = [...active].flatMap(
        ({ style, voyages }) => [...voyages].map(
            ({ voyage, pt }) => {
                const radius = renderStyles.getRadiusForVoyage(voyage)
                const { x, y } = map.latLngToLayerPoint(pt)
                return <InteractiveShip
                    key={voyage.id}
                    isSelected={voyage === selected}
                    voyage={voyage}
                    pt={[x - topLeft.x, y - topLeft.y]}
                    color={style}
                    radius={radius}
                    onClick={console.log}
                    onHover={setSelected} />
            })
    )
    return <SVGOverlay attributes={{ style: "pointer-events: auto; z-index: 5500;" }} bounds={bounds}>
        {children}
    </SVGOverlay>
}

interface TimelapseUIProps {
    year?: number
    paused: boolean
    onPlay: () => void
    onPause: () => void
    // chartData: any
}

const TimelapseUI = ({ year, paused, onPlay, onPause }: TimelapseUIProps) => {
    const size = useMapPosition()
    return <div style={{ position: 'absolute', top: 0, zIndex: 6000, width: size.width, height: size.height }}>
        <h1>{year}</h1>
        <button onClick={() => paused ? onPlay() : onPause()}>{paused ? 'Play' : 'Pause'}</button>
    </div>
}

/**
 * TODO: remove this once we can use the new API
 */
interface OBSOLETE_APIVoyageEntry {
    voyage_id: number
    src: number
    dst: number
    regsrc: number
    bregsrc: number
    regdst: number
    bregdst: number
    embarked: number
    disembarked: number
    year: number
    month: number
    ship_ton: number
    nat_id: number
    ship_name: string
}

const rndInteger = (max: number) => Math.round(Math.random() * max)

const OBSOLETE_legacyToVoyageRoute = (routeBuilder: MapRouteBuilder, entry: OBSOLETE_APIVoyageEntry): VoyageRoute => {
    // The start time is expressed in "days" elapsed, however since we not
    // always have a month available on record, we use a random value to better
    // distribute 
    const { year, month, embarked, disembarked } = entry
    const startTime = year * 360 + (month >= 1 && month <= 12
        ? (month - 1) * 30 + rndInteger(30)
        : rndInteger(360))
    // The animation duration is now randomly generated. Our time scale for the
    // routes are in "days", and an entire year in the timelapse goes relatively
    // quickly, hence the duration needs to be somewhat large otherwise the
    // ships would barely show up in the animation.
    const animationDuration = 180 + rndInteger(120)
    return {
        id: entry.voyage_id,
        startTime,
        embarked,
        disembarked,
        animationDuration,
        route: routeBuilder.getRoute(entry.src, entry.dst)
    }
}

const OBSOLETE_legacyVoyageCollection = async () => {
    const regionSeg: RegionSegments = OBSOLETE_regionalSegments
    const ports: PortCollectionData = await
        (await fetch(`${BASEURL}/timelapse/get-compiled-routes/?networkName=trans&routeType=port`, {
            headers: { 'Authorization': AUTHTOKEN }
        }))
            .json()
    const routeBuilder = new MapRouteBuilder(ports, regionSeg)
    const post = { "searchData": { "items": [{ "op": "is between", "searchTerm": [1514, 1866], "varName": "imp_arrival_at_port_of_dis" }], "orderBy": [] }, "output": "mapAnimation" }
    //const voyagesPromise = fetch(
    //    `${BASEURL}/timelapse/records/`, {
    //    method: 'POST',
    //    headers: {
    //        'Authorization': AUTHTOKEN,
    //        "Content-Type": "application/json",
    //    },
    //    body: JSON.stringify(post)
    //})
    //const voyages: OBSOLETE_APIVoyageEntry[] = await (await voyagesPromise).json()
    const voyages: OBSOLETE_APIVoyageEntry[] = OBSOLETE_voyages
    // TODO: replace hardcoded args.
    return new VoyageRouteCollection(voyages.map(v => OBSOLETE_legacyToVoyageRoute(routeBuilder, v)), 0.3, 0.2)
}

export interface TimelapseMapProps {
    renderStyles: VoyageRouteRenderStyles
    collection: VoyageRouteCollection
    initialSpeed: number
    // minSpeed: number
    // maxSpeed: number
}

export const DemoTimelapseMap = () => {
    const loadedRef = useRef<boolean>(false)
    const [collection, setCollection] = useState<VoyageRouteCollection | null>(null)
    useEffect(() => {
        if (!loadedRef.current) {
            loadedRef.current = true
            OBSOLETE_legacyVoyageCollection().then(setCollection)
        }
    }, [])
    const baseLine = 200 // TODO: not hardcoded!
    const renderStyles: VoyageRouteRenderStyles = {
        styles: ['red'],
        getRadiusForVoyage: v => v.embarked <= baseLine ? 2 : Math.min(9, 2 * (1.0 + Math.log2(v.embarked / baseLine))),
        getStyleForVoyage: _ => 0
    }
    return collection && <TimelapseMap collection={collection} initialSpeed={1} renderStyles={renderStyles} />
}

interface Size { width: number, height: number }

export const TimelapseMap = ({ collection, initialSpeed, renderStyles }: TimelapseMapProps) => {
    const [zoomLevel, setZoomLevel] = useState<number>(3)
    const [pauseWin, setPauseWin] = useState<VoyageRouteCollectionWindow | null>(null)
    const [speed, setSpeed] = useState(initialSpeed)
    const [year, setYear] = useState<number | undefined>()
    const window = useRef<VoyageRouteCollectionWindow | undefined>()
    return <div className='mobile-responsive-map' style={{ paddingTop: "90px" }}>
        <MapContainer
            style={{ width: "95%" }}
            className="map-container"
        >
            <MapContainer
                center={MAP_CENTER}
                zoom={zoomLevel}
                className="lealfetMap-container"
                maxZoom={MAXIMUM_ZOOM}
                minZoom={MINIMUM_ZOOM}
                attributionControl={false}
                scrollWheelZoom={true}
                zoomControl={true}
                style={{ width: "95%" }}
            >
                <HandleZoomEvent
                    setZoomLevel={setZoomLevel}
                    setRegionPlace={() => { }}
                    zoomLevel={zoomLevel}
                />
                <TileLayer url={mappingSpecialists} />
                <LayersControl position="topright">
                    <LayersControl.Overlay name="River">
                        <TileLayer url={mappingSpecialistsRivers} />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Modern Countries">
                        <TileLayer url={mappingSpecialistsCountries} />
                    </LayersControl.Overlay>
                </LayersControl>
                <TimelapseUI
                    year={year}
                    paused={pauseWin !== null}
                    onPause={() => setPauseWin(window.current ?? null)}
                    onPlay={() => setPauseWin(null)} />
                <CanvasAnimation
                    collection={collection}
                    speed={speed}
                    paused={pauseWin !== null}
                    renderStyles={renderStyles}
                    onWindowChange={win => {
                        const prev = window.current
                        if (prev?.year() !== win.year()) {
                            setYear(win.year())
                        }
                        window.current = win
                    }} />
                {pauseWin !== null && <InteractiveVoyageRoutesFrame
                    window={pauseWin}
                    renderStyles={renderStyles} />}
            </MapContainer>
        </MapContainer>
    </div>
}