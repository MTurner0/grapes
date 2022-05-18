// Set the dimensions and margins of the graph
const width = 500;
const height = 500;

const svg = d3.select("#grape-site")
    .append("svg")
        .attr("width", 500)
        .attr("height", 500);

// "Dummy data": one entry per node
const data = [{"name": "Alice"}, {"name": "Bob"}, {"name":"Charlie"}, {"name": "Denise"},
            {"name": "Ed"}, {"name": "Fatima"}, {"name": "George"}, {"name": "Henry"},
            {"name": "Isabella"}, {"name": "Jonah"}, {"name": "Kaci"}, {"name": "Louise"},
            {"name": "Max"}, {"name": "Natalie"}, {"name": "Owen"}, {"name": "Penny"},
            {"name": "Quincy"}, {"name": "Riley"}, {"name": "Sarah"}, {"name": "Tom"},
            {"name": "Ursula"}, {"name": "Vera"}, {"name": "Winona"}, {"name": "Xavier"},
            {"name": "Yasmin"}, {"name": "Zach"}];

const z = d3.scaleLinear()
    .domain([0, 40])
    .range([1, 40]);

const node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
        .attr("r", 15)
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", "#641464")
        .style("fill-opacity", 0.75)
        .attr("stroke", "#4d194d")
        .style("stroke-width", 2)
        .call(d3.drag()
            .on("start", startDragged)
            .on("drag", dragged)
            .on("end", endDragged));


// Configure forces applied to nodes
const simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Set where the circles start
    .force("charge", d3.forceManyBody().strength(0.9)) // Set how strongly the nodes are attracted to each other
    .force("collide", d3.forceCollide().strength(0.05).radius(20).iterations(1)); // Set the force to prevent circles overlapping

// Apply forces to nodes and update positions
simulation
    .nodes(data)
    .on("tick", function(d) {
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

function startDragged(event, d) {
    if (!event.active) simulation.alphaTarget(0.03).restart();
        d.fx = d.x;
        d.fy = d.y;
}
function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}
function endDragged(event, d) {
    if (!event.active) simulation.alphaTarget(0.03);
        d.fx = null;
        d.fy = null;
}