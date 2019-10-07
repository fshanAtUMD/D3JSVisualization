"use strict";

function test() {
    alert("test!");
};

function make_map() {
    d3.queue()
        .defer(d3.json, '/static/states.json')
        .await(load_map);

    function load_map(error, states) {
        var margin = {top:50, left:50, right:50, bottom: 50};
        var height = 600 - margin.top - margin.bottom;
        var width = 1200 - margin.left - margin.right;

        var svg = d3.select("#map").append("svg")
                .attr("height", height + margin.top + margin.bottom)
                .attr("width", width + margin.left + margin.right)

        var projection = d3.geo.albersUsa()
            .scale(1000)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection);

        svg.append('path')
            .datum(topojson.feature(states, states.objects.usStates))
            .attr('d', path)
            .attr('class', 'states');
    };
};



function ready(error, data) {
    console.log(data)
};


