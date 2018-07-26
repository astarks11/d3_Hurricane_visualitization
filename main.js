//////////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries

var svgSize = 500;
var bands = 50;

var xScale = d3.scaleLinear().domain([0, bands]).  range([0, svgSize]);
var yScale = d3.scaleLinear().domain([-1,bands-1]).range([svgSize, 0]);

function createSvg(sel)
{
    return sel
        .append("svg")
        .attr("width", svgSize)
        .attr("height", svgSize);
}

function createRects(sel)
{
    return sel
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.Col); })
        .attr("y", function(d) { return yScale(d.Row); })
        .attr("width", 10)
        .attr("height", 10);
}

function createPaths(sel)
{
    return sel
        .append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d) {
            return "translate(" + xScale(d.Col) + "," + yScale(d.Row) + ")";
        })
        .append("path");
}

d3.selection.prototype.callReturn = function(callable)
{
    return callable(this);
};

//////////////////////////////////////////////////////////////////////////////

function glyphD(d) {
    var s1 = "M3,5 L7,5";
    var s2 = "M1,5 L9,5";
    var s3 = "M1,5 L9,5 M5,1 L5,9";
    var s4 = "M1,5 L9,5 M5,1 L5,9 M1,1 L9,9";
    var s5 = "M1,5 L9,5 M5,1 L5,9 M1,1 L9,9 M1,9 L9,1";
    var scale = d3.scaleQuantize().domain([0,500]).range([s1,s2,s3,s4,s5]);
    return scale(Math.abs(d.P));
}

function glyphStroke(d) {
    if (d.P > 0) {
        return "white";
    }
    return "black";
   
}

function colorT1(d) {
    var scale = d3.scaleLinear();
        scale.domain([-70,-60]);
        scale.range([0,100]);
    return d3.lab(scale(d.T),-50,-70);
}

function colorP1(d) {
    var scale = d3.scaleLinear(),conv;
    if (d.P < 0) {
        scale.domain([-500,0]); 
        scale.range([-500,0]);
        conv = scale(d.P);
        scale.range(["#4daf4a","#ffffff"]);
    } else {
        scale.domain([0,200]);
        scale.range([0,500]);
        conv = scale(d.P);
        scale.range(["#ffffff","#984ea3"]);
    }
    return scale(conv);
}

function colorPT(d) {
    // write this!
    // use d3.lab(lumenece,a-col,b-col) where lum = fun(d.T) && a-col = fun(d.P)
    return d3.lab(temp(d.T),0,press(d.P));
}

function colorT2(d) {
    var scale = d3.scaleLinear();
        scale.domain([-70,-60]);
        scale.range([0,100]);
    return d3.lab(scale(d.T),-50,-70);
}


function temp(d) {
    scale = d3.scaleLinear();
    scale.domain([-70,-60]);
    scale.range([0,100]);
    return scale(d);
}
function press(d) {
    var scale = d3.scaleLinear(),conv;
        scale.domain([-500,0,500]); 
        scale.range([-100,0,100]);
        conv = scale(d);

    return conv;
}
//////////////////////////////////////////////////////////////////////////////

d3.select("#plot1-temperature")
    .callReturn(createSvg)
    .callReturn(createRects)
    .attr("fill", colorT1);

d3.select("#plot1-pressure")
    .callReturn(createSvg)
    .callReturn(createRects)
    .attr("fill", colorP1);

d3.select("#plot2-bivariate-color")
    .callReturn(createSvg)
    .callReturn(createRects)
    .attr("fill", colorPT);

var bivariateSvg = d3.select("#plot3-bivariate-glyph")
        .callReturn(createSvg);

bivariateSvg
    .callReturn(createRects)
    .attr("fill", colorT2);

bivariateSvg
    .callReturn(createPaths)
    .attr("d", glyphD)
    .attr("stroke", glyphStroke)
    .attr("stroke-width", 1);
