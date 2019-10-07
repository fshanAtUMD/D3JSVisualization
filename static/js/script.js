"use strict";

function test() {
    alert("test!");
};

function makeMap() {
     var usMapDataPromise = d3.json("https://d3js.org/us-10m.v1.json");

    Promise.all([usMapDataPromise]).then(values => {
        var us = values[0];

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

        // Create SVG element and append to map
        var svg = d3.select("#map").append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)

        // Render GeoJSON object as an svg path element
        svg.selectAll("path")
            .data(geoFeatures)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "states");

        // Draw state borders
        svg.append("path")
            .attr("d", path(geoObj))
            .attr("class", "state-borders");
    });
};



function ready(error, data) {
    console.log(data)
};


