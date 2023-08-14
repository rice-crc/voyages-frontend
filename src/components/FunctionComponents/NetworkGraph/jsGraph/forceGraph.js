import * as d3 from 'd3';
const width = 600
const height = 600
export const forceGraph = (data) => {
    const w2 = width / 2,
        h2 = height / 2,
        nodeRadius = 15;

    const ctx = DOM.context2d(width, height);
    const canvas = ctx.canvas;

    const simulation = forceSimulation(width, height);
    let transform = d3.zoomIdentity;

    // The simulation will alter the input data objects so make
    // copies to protect the originals.

    const nodes = data.nodes.map(d => Object.assign({}, d));
    const edges = data.edges.map(d => Object.assign({}, d));


    d3.select(canvas)
        .call(d3.drag()
            // Must set this in order to drag nodes. New in v5?
            .container(canvas)
            .subject(dragSubject)
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded))
        .call(d3.zoom()
            .scaleExtent([1 / 10, 8])
            .on('zoom', zoomed));


    // HERE Is the issue??? NEW Code ========================================================
    simulation.nodes(nodes)
        .force("link", d3.forceLink(edges).id(node => node.uuid).distance(80))
        .on("tick", simulationUpdate);
    // ========================================================

    // =====  HERE Is the issue??? OLD Code!! =================
    // simulation.nodes(nodes)
    //   .on("tick",simulationUpdate);
    // simulation.force("link")
    //   .links(edges);
    // ========================================================
    function zoomed() {
        transform = d3.event.transform;
        simulationUpdate();
    }

    /** Find the node that was clicked, if any, and return it. */
    function dragSubject() {
        const x = transform.invertX(d3.event.x),
            y = transform.invertY(d3.event.y);
        const node = findNode(nodes, x, y, nodeRadius);
        if (node) {
            node.x = transform.applyX(node.x);
            node.y = transform.applyY(node.y);
        }
        // else: No node selected, drag container
        return node;
    }

    function dragStarted() {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        d3.event.subject.fx = transform.invertX(d3.event.x);
        d3.event.subject.fy = transform.invertY(d3.event.y);
    }

    function dragged() {
        d3.event.subject.fx = transform.invertX(d3.event.x);
        d3.event.subject.fy = transform.invertY(d3.event.y);
    }

    function dragEnded() {
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }

    function simulationUpdate() {
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.k, transform.k);
        const allGroups = [...new Set(nodes.map((d) => d.node_class))];
        const colorScale = d3.scaleOrdinal().domain(allGroups).range(d3.schemePastel1);

        // Draw edges
        edges.forEach(function (d) {
            ctx.beginPath();
            ctx.moveTo(d.source.x, d.source.y);
            ctx.lineTo(d.target.x, d.target.y);
            ctx.lineWidth = Math.sqrt(d.value);
            ctx.strokeStyle = '#aaa';
            ctx.stroke();
        });

        // Draw nodes
        nodes.forEach(function (d, i) {
            ctx.beginPath();
            // Node fill
            ctx.moveTo(d.x + nodeRadius, d.y);
            ctx.arc(d.x, d.y, nodeRadius, 0, 2 * Math.PI);
            // ctx.ellipse(d.x, d.y, 25, 15, Math.PI / 150, 0, 2 * Math.PI);
            ctx.fillStyle = colorScale(String(d.node_class));


            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = '1.5'
            ctx.stroke();
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textHeight = -25;
            const labelX = d.x;
            const labelY = d.y + nodeRadius + textHeight / 2;
            ctx.fillText(String(d.id), labelX, labelY);

        });
        // ============================================================
        ctx.restore();
    }

    return canvas;
}

function findNode(nodes, x, y, radius) {
    const rSq = radius * radius;
    let i;
    for (i = nodes.length - 1; i >= 0; --i) {
        const node = nodes[i],
            dx = x - node.x,
            dy = y - node.y,
            distSq = (dx * dx) + (dy * dy);
        if (distSq < rSq) {
            return node;
        }
    }
    // No node selected
    return undefined;
}

function forceSimulation(width, height) {
    console.log('forceSimulation')
    return d3.forceSimulation()
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().id(d => d.uuid));
}