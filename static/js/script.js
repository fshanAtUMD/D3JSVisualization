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

    var byWeekStateRecords = values[2];
    var weekStateDelayCountMap = byWeekStateRecords.reduce((a, d) => {
        if (a[d.id]) {a[d.id].push([d.day_of_week, d.count]);}
        else a[d.id] = [[d.day_of_week, d.count]];
        return a;}, {});

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
    var mapSvg = d3.select("#map").append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right);

    // Render GeoJSON object as an svg path element
    mapSvg.selectAll("path")
        .data(geoFeatures)
        .enter()
        .append("path")
        .attr("class", "states")
        .attr("d", path)
        .attr("fill", delayCountScheme)
        .attr("transform", "translate(0, 0)")
        .on("click", handleClick)
        .on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseout", handleMouseOut);

    // Draw state borders
    mapSvg.append("path")
        .attr("d", path(geoObj))
        .attr("class", "state-borders")
        .attr("fill", "none");

    // Create bar chart
    height = 300 - margin.top - margin.bottom;
    width = 400 - margin.left - margin.right;

    var barSvg = d3.select("#bar")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(byWeekStateRecords.map(d => d.day_of_week))
        .padding(0.2);
    barSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // title
    barSvg.append("text")
      .attr("class", "bar-chart-title")
      .attr("transform",
            "translate(" + (width/2) + " ," +  (height + margin.top/4*3) + ")")
      .style("text-anchor", "middle")
      .text("Delays by day of week in one airport");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(byWeekStateRecords.map(d => d.count))])
        .range([height, 0]);
    barSvg.append("g")
        .attr("class", "myYaxis")
        .call(d3.axisLeft(y));

    // functions
    function handleClick(d, i) {
        // mouse click event
        d3.select(this).transition()
            .duration("50")
            .attr("opacity", ".85");
//        // display with mouse click
//        clickDiv.html("Total Number of delays: " + delayCountMap[d.id]
//            + "<br> Total Number of airports: " + airportCountMap[d.id])
//            .style("display", "inline");
        // bar chart with mouse click
        var u = barSvg.selectAll("rect").data(weekStateDelayCountMap[d.id]);
        u.enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration("1000")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d[1]))
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d[1]); })
            .attr("fill", "#69b3a2")
    };

    function handleMouseOver(d, i) {
        // display with mouse click
        clickDiv.html("Total Number of delays: " + delayCountMap[d.id]
            + "<br> Total Number of airports: " + airportCountMap[d.id])
            .style("display", "inline");
    };

    function handleMouseMove(d, i) {
        // display with mouse click
        clickDiv
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY + 20) + "px");
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
            mapSvg.selectAll(".states")
                .attr("fill", delayCountScheme);
        } else {
            mapSvg.selectAll(".states")
                .attr("fill", airportCountScheme);
        }
    };

})
.catch(error => console.log(error));

function ready(error, data) {
    console.log(data);
};


