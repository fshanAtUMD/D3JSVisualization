"use strict";

function test() {
    alert("test!");
};

function makeMap() {
    d3.queue()
        .defer(d3.json, 'static/json/states.json')
        .await(loadMap);

    function loadMap(error, states) {
        console.log(states)
        //Width and height of map
        var margin = {top:50, left:50, right:50, bottom: 50};
        var height = 600 - margin.top - margin.bottom;
        var width = 1200 - margin.left - margin.right;

        // D3 Projection
        var projection = d3.geo.albersUsa()
            .translate([width / 2, height / 2]) // translate to center of screen
            .scale(1000); // scale things down so see entire US

        // Define path generator
        var path = d3.geo.path() // path generator that will convert GeoJSON to SVG paths
            .projection(projection); // tell path generator to use albersUsa projection

        // Define linear scale for output
        var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

        // Create SVG element and append map to the SVG
        var svg = d3.select("#map").append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)

        // Append Div for tooltip to SVG
        var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

        // Bind the data to the SVG and create path
        svg.append('path')
            .datum(topojson.feature(states, states.objects.usStates))
            .attr('d', path)
            .attr('class', 'states');
    };
};



function ready(error, data) {
    console.log(data)
};


