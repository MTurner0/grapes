// Set the dimensions and margins of the graph
const width = 500;
const height = 500;
const margin = 15;

// create scales and axes
const xmin = -50;
const xmax = 50;
const ymin = -50;
const ymax = 50;

const xScale = d3.scaleLinear()
    .domain([xmin, xmax])
    .range([margin, width - margin * 2]);

const yScale = d3.scaleLinear()
    .domain([ymin, ymax])
    .range([height - margin, margin ]);

const xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5);

const yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5);

// Create svg
const svg = d3.select("#grape-site")
    .append("svg")
        .attr("width", 500)
        .attr("height", 500);

//Create X axis
svg.append("g")
	.attr("transform", `translate(0, ${yScale(0)})`)
	.call(xAxis);

//Create Y axis
svg.append("g")
	.attr("transform", `translate(${xScale(0)}, 0)`)
	.call(yAxis);

// "Dummy data": one entry per node
const data = [{"name": "Alice"}, {"name": "Bob"}, {"name":"Charlie"}, {"name": "Denise"},
            {"name": "Ed"}, {"name": "Fatima"}, {"name": "George"}, {"name": "Henry"},
            {"name": "Isabella"}, {"name": "Jonah"}, {"name": "Kaci"}, {"name": "Louise"},
            {"name": "Max"}, {"name": "Natalie"}, {"name": "Owen"}, {"name": "Penny"},
            {"name": "Quincy"}, {"name": "Riley"}, {"name": "Sarah"}, {"name": "Tom"},
            {"name": "Ursula"}, {"name": "Vera"}, {"name": "Winona"}, {"name": "Xavier"},
            {"name": "Yasmin"}, {"name": "Zach"}];

const node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
        .attr("r", 10)
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
    .force("collide", d3.forceCollide().strength(0.05).radius(10).iterations(1)); // Set the force to prevent circles overlapping

// Apply forces to nodes and update positions
simulation
    .nodes(data)
    .on("tick", function(d) {
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    })
    .on("end", () => {
        let xVals = [];
        let yVals = [];
        d3.selectAll('circle').each(function () {
          const thisD3 = d3.select(this)
          xVals.push(thisD3.attr('cx'));
          yVals.push(thisD3.attr('cy'));
        });
        broadcast(xVals, yVals);
        console.log(xVals);
        console.log(yVals);
    });

function startDragged(event, d) {
    if (!event.active) simulation.alphaTarget(0.03).restart();
        d.fx = d.x;
        d.fy = d.y;
}
function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
    broadcast();
}
function endDragged(event, d) {
    if (!event.active) simulation.alphaTarget(0.03);
        d.fx = null;
        d.fy = null;
    let xVals = [];
    let yVals = [];
    d3.selectAll('circle').each(function () {
        const thisD3 = d3.select(this)
        xVals.push(thisD3.attr('cx'));
        yVals.push(thisD3.attr('cy'));
      });
    broadcast(x = xVals, y = yVals);
    console.log(xVals);
    console.log(yVals);
}

// Calculate correlation coefficient
function broadcast(x, y) {
    Sxx = d3.sum(x.map(d => Math.pow(d-d3.mean(x), 2)));
    Sxy = d3.sum(x.map( (d, i) => (x[i]-d3.mean(x))*(y[i]-d3.mean(y))));
    Syy = d3.sum(y.map(d => Math.pow(d-d3.mean(y), 2)));
    corrcoef = -Sxy/(Math.sqrt(Sxx)*Math.sqrt(Syy));
    d3.select("#r").text(`r = ${corrcoef.toFixed(2)}`);
};