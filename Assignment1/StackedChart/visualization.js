var dataset = [],
    activatedColumns = [],
    /*Width and height*/
    w = 630,
    h = 300,
    barPadding = 5,
    padding = 60,
    duration = 500,
    grouped = false;


var width = 800;
var height = 800;
var labels = ["Personen tussen 0 en 14 jaar oud", "Personen tussen 15 en 24 jaar oud", "Personen tussen 25 en 44 jaar oud", "Personen tussen 45 en 64 jaar oud", "Personen van 65 jaar en ouder"];

var yScale, svg, groups;
var stack = d3.layout.stack();
var cityData = d3.map();
var colors = ["#56524a", "#f2e1bc", "#e9c338", "#0080ff", "#49607f", "#d0743c", "#ff8c00"];

var linearColorScale = d3.scale.linear()
    .domain([0.0, 100.0])
    .range(["white", "red"]);
var svgMap = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var mapData;

var gemeenteCodesSelected = new Array();
var gemeenteNamenSelected = new Array();

//[not selected, mouse over and not selected,selected,mouse over and selected]
var gemeenteColors = ["#F1F1F1", "#CFCFCF", "#5E5E5E", "#BBBBBB"];
//last province we clicked on. Becomes null as soon as mouse leaves the gemeente
var clickedOnGemeente = null;

var projection = d3.geo.albers()
    .rotate([0, 0])
    .center([5.6, 52.1])
    .parallels([50, 53])
    .scale(15000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);


var gMap = svgMap.append("g");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);


function draw() {
    dataset = [];
    stack = d3.layout.stack();
    var elements = document.getElementsByClassName('info-chart')[0].getElementsByTagName('svg');
    for (var ix = 0; ix < elements.length; ix++) {
        elements[ix].parentNode.removeChild(elements[ix]);
    }

    var rray0 = [],
        rray15 = [],
        rray25 = [],
        rray45 = [],
        rray65 = [];
    for (var i = 0; i < activatedColumns.length; i++) {
        var newObject0 = {},
            newObject15 = {},
            newObject25 = {},
            newObject45 = {},
            newObject65 = {};
        newObject0.x = i;
        newObject15.x = i;
        newObject25.x = i;
        newObject45.x = i;
        newObject65.x = i;
        
        newObject0.p = 0;
        newObject15.p = 1;
        newObject25.p = 2;
        newObject45.p = 3;
        newObject65.p = 4;

        newObject0.y = parseInt(cityData.get(activatedColumns[i])[1]);
        newObject15.y = parseInt(cityData.get(activatedColumns[i])[2]);
        newObject25.y = parseInt(cityData.get(activatedColumns[i])[3]);
        newObject45.y = parseInt(cityData.get(activatedColumns[i])[4]);
        newObject65.y = parseInt(cityData.get(activatedColumns[i])[5]);

        rray0.push(newObject0);
        rray15.push(newObject15);
        rray25.push(newObject25);
        rray45.push(newObject45);
        rray65.push(newObject65);
    }
    dataset.push(rray0);
    dataset.push(rray15);
    dataset.push(rray25);
    dataset.push(rray45);
    dataset.push(rray65);

    stack(dataset);

    /* Define Y scale */
    yScale = d3.scale.linear()
        .domain([0,
            d3.max(dataset, function(d) {
                return d3.max(d, function(d) {
                    return parseInt(d.y0) + parseInt(d.y);
                });
            })
        ])
        .range([h, padding]);

    /* Create SVG element */
    svg = d3.select(".info-chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
        var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    /* Add a group for each row of data */
    groups = svg.selectAll("g")
        .data(dataset)
        .enter()
        .append("g")
        .style("fill", function(d, i) {
            return colors[i];
        });
    svg.append("p").html("Test");
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");



    groups.selectAll("rect")
        .data(function(d) {
            console.log(d);
            return d;
        })
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            console.log(d);
            return i * (w / dataset[0].length);
        })
        .attr("i", function(d, i) {
            console.log(i);
            return i;
        })
        .attr("y", function(d) {
            return yScale(d.y) + yScale(d.y0) - h;
        })
        .attr("width", w / dataset[0].length - barPadding)
        .attr("height", function(d) {
            return h - yScale(d.y);
        })
        .on("mouseover", function(d) {
            /* Get this bar's x/y values, then augment for the tooltip */
            var xPosition,
                yPosition = parseInt(d3.select(this).attr("y"))-50;

            if (d3.select(this).attr("x") < 350) {

                if (grouped) {
                    console.log("We be grouped!");
                    xPosition = parseFloat(d3.select(this).attr("x")) + 14;
                } else {
                    xPosition = parseFloat(d3.select(this).attr("x")) + 27;
                }

                d3.select(".tooltip").classed("tooltip-left", false).classed("tooltip-right", true);
            } else {
                xPosition = parseFloat(d3.select(this).attr("x")) - 143;
                d3.select(".tooltip").classed("tooltip-left", true).classed("tooltip-right", false);;
            }

            /* Update the tooltip position and value */
            d3.select(".tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .style("width", "250px")
                .select(".value")
                .text(d.y);
            d3.select(".tooltip")
                .select(".persons")
                .text(Math.ceil(parseInt(cityData.get(activatedColumns[d.x])[6])*parseInt(d.y)/100));
            d3.select(".tooltip")
                .select(".municipality")
                .text(cityData.get(activatedColumns[d.x])[0]);
        d3.select(".tooltip")
                .select(".label")
                .text(labels[d.p]);

            /* Show the tooltip */
            d3.select(".tooltip").classed("hidden", false);

        })
        .on("mouseout", function() {
            /* Hide the tooltip */
            d3.select(".tooltip").classed("hidden", true);
        });
}


d3.selectAll("input").on("change", change);

function change() {
    if (this.value === "grouped") {
        grouped = true;
        transitionGrouped();
    } else {
        grouped = false;
        transitionStacked();
    }
}

var transitionGrouped = function() {
    groups.selectAll("rect")
        .transition()
        .duration(duration)
        .delay(function(d, i) {
            return i / dataset[0].length * duration;
        })
        .attr("width", (w / dataset[0].length - barPadding) / 5)
        .transition()
        .duration(duration)
        .attr("x", function(d, i, j) {
            return i * (w / dataset[0].length) + ((w / dataset[0].length - barPadding) / 5) * j;
        })
        .transition()
        .duration(duration)
        .attr("y", function(d, i, j) {
            return yScale(d.y);
        });
};

var transitionStacked = function() {
    groups.selectAll("rect")
        .transition()
        .duration(duration)
        .delay(function(d, i) {
            return i / dataset[0].length * duration;
        })
        .attr("y", function(d) {
            return yScale(d.y) + yScale(d.y0) - h;
        })
        .transition()
        .duration(duration)
        .attr("x", function(d, i) {
            return i * (w / dataset[0].length);
        })
        .transition()
        .duration(duration)
        .attr("width", w / dataset[0].length - barPadding);
};

queue()
    .defer(d3.json, "cities-geometry.json")
    .defer(d3.tsv, "cities-data.txt")
    .await(dataLoaded);

function dataLoaded(error, loadedMapData, newCityData) {
    console.log(cityData);
    //console.log(newCityData);
    newCityData.forEach(function(v, k) {

        cityData.set(v.Code, [v.Naam, v.P_00_14_JR, v.P_15_24_JR, v.P_25_44_JR, v.P_45_64_JR, v.P_65_EO_JR, v.AANT_INW]);
    });
    console.log(cityData.size());
    mapData = loadedMapData;
    //var maxValue = 0;
    //newCityData
    //d3.max(newCityData.values());
    //console.log("The maximum value is " + maxValue);
    //linearColorScale.domain([0.0, maxValue]);
    gMap.selectAll("path")
        .data(mapData.features).enter()
        .append("path")
        .attr("d", path)
        .attr('id', function(d) {
            //console.log(d.gm_code);
            return d.gm_code;
        })
        .on("mouseenter", mouseEnterGemeente)
        .on("mouseout", mouseOutGemeente)
        .on("click", mouseClickGemeente)
        .style("fill", gemeenteColors[0]);
}

function addColumn(code) {
    if (!cityData.has(code)) {
        console.log(code + " is not in the cityData, unable to add column");
    } else if (activatedColumns.indexOf(code) > -1) {
        console.log('is al toegevoegd');
    } else {
        activatedColumns.push(code);
        draw();
    }
}

function removeColumn(code) {
    if (activatedColumns.indexOf(code) <= -1) {
        console.log(code + " is not activated");

    } else {
        var index = activatedColumns.indexOf(code);
        if (index > -1) {
            activatedColumns.splice(index, 1);
            draw();
        } else {
            console.log('Could not remove ' + code);
        }
    }
}

function contained(gemeenteCode) {
    var index = gemeenteCodesSelected.indexOf(gemeenteCode);
    if (index === -1) {
        return (false);
    }
    return (true);
}

function mouseEnterGemeente(d) {
    //console.log("enter");
    var gemeenteNaam = d.gm_naam;
    var gemeenteCode = d.gm_code;
    d3.select('#wtf h2').html(gemeenteNaam); //displays the name
    //don't change the color after we just clicked on this state.
    if (contained(gemeenteCode)) {
        //make visible that it can be deselected
        d3.select(this).style("fill", gemeenteColors[3]);
    } else {
        //make visible that it can be selected
        d3.select(this).style("fill", gemeenteColors[1]);
    }
};

function mouseOutGemeente(d) {
    var gemeenteCode = d.gm_code;

    if (contained(gemeenteCode)) {
        //it was selected
        d3.select(this).style("fill", gemeenteColors[2]);
    } else {
        //it was not selected
        d3.select(this).style("fill", gemeenteColors[0]);
    }
}

function mouseClickGemeente(d) {
    console.log("click");
    var gemeenteNaam = d.gm_naam
    var gemeenteCode = d.gm_code;

    //check if the state was already selected
    if (contained(gemeenteCode)) //it was already in
    {
        removeGemeente(gemeenteNaam, gemeenteCode);
        d3.select(this).style("fill", gemeenteColors[0]);
        
    } else //it was not yet in
    {
        addGemeente(gemeenteNaam, gemeenteCode);
        
        d3.select(this).style("fill", gemeenteColors[2]);

    }
    //console.log(gemeenteNamenSelected);
}


function addGemeente(gemeenteNaam, gemeenteCode) {
    gemeenteCodesSelected.push(gemeenteCode);
    gemeenteNamenSelected.push(gemeenteNaam);
    addColumn(gemeenteCode);

    updateSelected();
}

function removeGemeente(gemeenteNaam, gemeenteCode) {
    var index = gemeenteCodesSelected.indexOf(gemeenteCode);
    gemeenteCodesSelected.splice(index, 1);
    removeColumn(gemeenteCode);

    var index = gemeenteNamenSelected.indexOf(gemeenteNaam);
    gemeenteNamenSelected.splice(index, 1);

    updateSelected();
}

function updateSelected() {
        d3.select("#selectedGemeentes").select("table").selectAll("*").remove();
        d3.select("#selectedGemeentesUitleg").selectAll("h2").remove();
        if (gemeenteNamenSelected.length === 0) {
            d3.select("#selectedGemeentesUitleg").append("h2")
                .text("Selecteer op de kaart de provincies waarin u geinteresser bent")
        } else {
            d3.select("#selectedGemeentesUitleg").append("h2")
                .text("Uw geselecteerde provincies")

        }
        for (i = 0; i < gemeenteNamenSelected.length; i++) {
            var tr = d3.select("#selectedGemeentes").select("table").append("tr");
            tr.append("td").text(gemeenteNamenSelected[i]);
            tr.append("button")
                .attr("gemeenteNaam", gemeenteNamenSelected[i])
                .text("Haal deze gemeente weg")
                .on("click", function() {
                    //don't ask why i-1
                    var naam = this.getAttribute("gemeenteNaam");
                    var code = nameToCode(naam);
                    console.log(this);
                    //                    unmark the province on the map
                    //                    find the code so we cna unmark it on the map

                    removeGemeente(naam, code);

                    d3.selectAll("path#" + code).style("fill", gemeenteColors[0]);
                });
        }

        function nameToCode(name) {
            console.log("init: " + name)
            for (var i = 0; i < mapData.features.length; i++) {
                if (mapData.features[i].gm_naam === name) {
                    return (mapData.features[i].gm_code);
                }
            }
            return (null);
        }
    }
    //var maxValue = d3.max(cityData.values());
    //console.log("The maximum value is " + maxValue);