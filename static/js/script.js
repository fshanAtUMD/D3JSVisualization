"use strict";

function test() {
    alert("test!");
};

var usMapDataPromise = d3.json("https://d3js.org/us-10m.v1.json");
var delayCountByStateDataPromise = d3.json("http://localhost:5000/delay_count_by_state");
var weeklyByStateDataPromise = d3.json("http://localhost:5000/delay_count_by_state_week");

Promise.all([usMapDataPromise, delayCountByStateDataPromise, weeklyByStateDataPromise]).then(values => {
    var us = values[0];
    var byStateRecords = values[1];
    var delayCountMap = byStateRecords.reduce((a, d) => {a[d.id] = d.count; return a;}, {});
    var airportCountMap = byStateRecords.reduce((a, d) => {a[d.id] = d.airports; return a;}, {});

    var populations = values[2];
    var populationsMap = populations.reduce((a, d) => {a[d.id] = d.population_est_july_2018; return a;}, {});
    console.log(populations);

    //Width and height of map
    var margin = {top:50, left:50, right:50, bottom: 50};
    var height = 600 - margin.top - margin.bottom;
    var width = 1200 - margin.left - margin.right;

    var clickDiv = d3.select("#click-info")
        .style("display", "none");

    var chooseMeasureDiv = d3.select("#measure")
        .append("select")
        .on("change", handleOnChange);
    chooseMeasureDiv.append("option")
        .text("Number of Delayed Flights")
        .attr("value", "delayCount");
    chooseMeasureDiv.append("option")
        .text("Number of Airports")
        .attr("value", "airportCount");

    // Used for changing measure
    var isDelayCount = true;

    // Define path generator
    var path = d3.geoPath(); // path generator that will convert GeoJSON to SVG paths

    // Filter geometry objects
    var geoMeshFilter = (a, b) => a !== b;

    // Get GeoJson MultiLineString object representing the mesh of states
    var geoObj = topojson.mesh(us, us.objects.states, geoMeshFilter);

    // Get GeoJson features of of a specified object in a topology
    var geoFeatures = topojson.feature(us, us.objects.states).features;

    // Create scale scheme
    var delayScale = d3.scaleQuantize()
        .domain([
            d3.min(byStateRecords.map(d => d.count)),
            d3.max(byStateRecords.map(d => d.count))
        ])
        .range(d3.schemeReds[7]);

    var airportScale = d3.scaleQuantize()
        .domain([
            d3.min(byStateRecords.map(d => d.airports)),
            d3.max(byStateRecords.map(d => d.airports))
        ])
        .range(d3.schemePurples[7]);

    var delayCountScheme = d => delayScale(delayCountMap[d.id])
    var airportCountScheme = d => airportScale(airportCountMap[d.id])

    // Create SVG element and append to map
    var svg = d3.select("#map").append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right);

    // Render GeoJSON object as an svg path element
    svg.selectAll("path")
        .data(geoFeatures)
        .enter()
        .append("path")
        .attr("class", "states")
        .attr("d", path)
        .attr("fill", delayCountScheme)
        .attr("transform", "translate(0, 0)")
        .on("click", handleClick)
        .on("mouseout", handleMouseOut);

    // Draw state borders
    svg.append("path")
        .attr("d", path(geoObj))
        .attr("class", "state-borders")
        .attr("fill", "none");


    // Create bar chart


    // functions
    function handleClick(d, i) {
        // mouse click event
        d3.select(this).transition()
            .duration("50")
            .attr("opacity", ".85");
        // display with mouse click
        clickDiv.html("Total Number of delays: " + delayCountMap[d.id]
            + "<br> Total Number of airports: " + airportCountMap[d.id])
            .style("display", "inline");
    };

    function handleMouseOut(d, i) {
        // mouse out event
        d3.select(this).transition()
            .duration("50")
            .attr("opacity", "1");
        // disappear with mouse out
        clickDiv.style("display", "none");
    };

    function handleOnChange() {
        isDelayCount = !isDelayCount;

        if (isDelayCount) {
            svg.selectAll(".states")
                .attr("fill", delayCountScheme);
        } else {
            svg.selectAll(".states")
                .attr("fill", airportCountScheme);
        }
    };

})
.catch(error => console.log(error));

function ready(error, data) {
    console.log(data);
};


