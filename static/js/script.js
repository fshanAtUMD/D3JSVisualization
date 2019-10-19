"use strict";

function test() {
    alert("test!");
};

function makeMap() {
    var usMapDataPromise = d3.json("https://d3js.org/us-10m.v1.json");
    var DelayCountByStateDataPromise = d3.json("http://localhost:5000/delay_count_by_state");
    var populationDataPromise = d3.json("https://raw.githubusercontent.com/leibatt/example-datasets/master/us_state_populations.json");

    Promise.all([usMapDataPromise, DelayCountByStateDataPromise, populationDataPromise]).then(values => {
        var us = values[0];

        var delayCount = values[1];
        var delayCountMap = delayCount.reduce((a, d) => {a[d.id] = d.count; return a;}, {});

        var populations = values[2].data;
        var populationsMap = populations.reduce((a, d) => {a[d.id] = d.population_est_july_2018; return a;}, {});
        console.log(delayCount);

        //Width and height of map
        var margin = {top:50, left:50, right:50, bottom: 50};
        var height = 600 - margin.top - margin.bottom;
        var width = 1200 - margin.left - margin.right;

        // Define path generator
        var path = d3.geoPath(); // path generator that will convert GeoJSON to SVG paths

        // Filter geometry objects
        var geoMeshFilter = (a, b) => a !== b;

        // Get GeoJson MultiLineString object representing the mesh of states
        var geoObj = topojson.mesh(us, us.objects.states, geoMeshFilter);

        // Get GeoJson features of of a specified object in a topology
        var geoFeatures = topojson.feature(us, us.objects.states).features;

        var cScale = d3.scaleQuantize()
            .domain([
                d3.min(delayCount.map(d => d.count)),
                d3.max(delayCount.map(d => d.count))
            ])
            .range(d3.schemeReds[5]);

        var dScale = d3.scaleQuantize()
            .domain([
                d3.min(populations.map(d => d.population_est_july_2018)),
                d3.max(populations.map(d => d.population_est_july_2018))
            ])
            .range(d3.schemeReds[9]);

        // For mouse over display
        var mouseOverDiv = d3.select("body").append("div")
             .attr("class", "tooltip-states")
             .style("display", "none");

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
            .attr("fill", d => cScale(delayCountMap[d.id]))
            .attr("transform", "translate(0, 0)")
            .on("mouseover", handleMouseOver)
            .on("mousemove", handleMouseMove)
            .on("mouseout", handleMouseOut);

        // Draw state borders
        svg.append("path")
            .attr("d", path(geoObj))
            .attr("class", "state-borders")
            .attr("fill", "none");


        // functions
        function handleMouseOver(d, i) {
            // mouse over event
            d3.select(this).transition()
                .duration("50")
                .attr("opacity", ".85");
            // display with mouse over
            mouseOverDiv.style("display", "inline");
        };


        function handleMouseMove(d, i) {
            mouseOverDiv.text("Total num of delays: " + delayCountMap[d.id])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 20) + "px");
        }


        function handleMouseOut(d, i) {
            // mouse out event
            d3.select(this).transition()
                .duration("50")
                .attr("opacity", "1");
            // disappear with mouse out
            mouseOverDiv.style("display", "none");
        };

    })
    .catch(error => console.log(error));
};


function makeBarChart() {

};








function ready(error, data) {
    console.log(data);
};


