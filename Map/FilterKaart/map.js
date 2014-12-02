
var width = 800;
var height = 800;

var cityData = d3.map();



var linearColorScale = d3.scale.linear()
        .domain([0.0, 100.0])
        .range([0, 1])

var colorInterpolator = d3.interpolateHsl("green", "red");

var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

// Define 'div' for tooltips
var toolTipdiv = d3.select("#map")
        .append("div")  // declare the tooltip div 
        .attr("class", "tooltip")              // apply the 'tooltip' class
        .style("opacity", 0);                  // set the opacity to nil

var minValue = 0;
var maxValue = 0;

var mapData;
var gemeenteNaam = "Appingedam";
var gemeenteCode = "GM0003";

var filterColors = ["#000000", "#000000", "#000000", "#000000"];//unselected,hover unselected,hover selected,selected
var currentFilter = "AANT_MAN";
var filterList = new Array();

// Setup the map projection for a good depiction of The Netherlands. The
// projection is centered on the geographical center of the country, which
// happens to be the city of Lunteren.
var projection = d3.geo.albers()
        .rotate([0, 0])
        .center([5.6, 52.1])
        .parallels([50, 53])
        .scale(15000)
        .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

var g = svg.append("g");

queue()
        .defer(d3.json, "cities-geometry.json")
        .defer(d3.tsv, "cities-data.txt")
        .await(dataLoaded);


function dataLoaded(error, loadedMapData, newCityData) {
    mapData = loadedMapData;

    newCityData.forEach(function(v, k) {
        cityData.set(v.Code, v);
    });
    console.log(cityData);
    var maxValue = d3.max(cityData.values());
    console.log("The maximum value is " + maxValue);
    linearColorScale.domain([0.0, maxValue]);

    g.selectAll("path")
            .data(loadedMapData.features).enter()
            .append("path")
            .attr("d", path)
            .attr('id', function(d) {
                return d.gm_code;
            })
            .on("mouseover", mouseEnterGemeente)
            .on("mouseout", function(d) {
                //color the province
                d3.select(this).style("opacity", 1);
                //out trigger before over, thus opacity to 0 if we change place
                toolTipdiv.transition()
                        .duration(800)
                        .style("opacity", 0);

            })


    //initialize for the filter



    for (var key in cityData.get("GM0003"))
    {
        if (key !== "Code" && key !== "Naam" && key !== "GM_CODE" && key != "GM_NAAM" && key != "WATER")
        {
            filterList.push(key);
        }
    }

    //make the dropdown menu
    var filter = d3.select("#filter");
    var select = filter.append("select")
            .on("change", change);
    options = select.selectAll("option").data(filterList);//add the data
    options.enter().append("option").text(function(d) {
        return d;
    });//add buttons by data
    //initialize the map
    newFilter();

    //on change of the drop down
    function change()
    {
        var selectedIndex = select.property('selectedIndex');

        currentFilter = options[0][selectedIndex].__data__;


        newFilter();
        console.log(currentFilter);
    }


    function newFilter()
    {
        minValue = 999999999;
        maxValue = -1;
        var average = 0;

        console.log(cityData.values())
        for (var i = 0; i < cityData.values().length; i++)
        {

            var value = parseFloat(cityData.values()[i][currentFilter]);
            average += value;
            if (value <= -1)
            {
                //do nothing, data is invalid
            }
            else
            {
                minValue = value < minValue ? value : minValue;
                maxValue = value > maxValue ? value : maxValue;
            }
        }
        console.log(minValue);

        linearColorScale = d3.scale.linear()
                .domain([minValue, maxValue])
                .range([0, 1]);

        g.selectAll("path")
                .transition()
                .duration(700)
                .delay(function(d) {
                    return(50 * (53 - d.geometry['coordinates'][0][0][0][1]))
                })
                .style("fill", function(d) {
                    var gemeenteCode = d.properties["gm_code"];
                    if (!cityData.get(gemeenteCode))
                    {
                        return("#E7E7E7");
                    }
                    else
                    {
                        return(colorInterpolator(linearColorScale(cityData.get(gemeenteCode)[currentFilter])));
                    }
                });


        //missing data
        if (cityData.get(gemeenteCode))
        {
            var value = cityData.get(gemeenteCode)[currentFilter]
            d3.select('#wtf h2').html("Gemeentenaam: " + gemeenteNaam + "<br />" + currentFilter + " : " + cityData.get(gemeenteCode)[currentFilter]);//displays the name            
        }
        else
        {
            d3.select('#wtf h2').html("Gemeentenaam: " + gemeenteNaam + "<br />" + currentFilter + " : Er is geen data beschikbaar voor deze gemeente");//displays the name
        }
        updateColorScale();
    }



    function updateColorScale()
    {
        var legend = d3.select("#legend");
        legend.selectAll("*").remove();
        for (var i = 0; i < 11; i++)
        {
            value = Math.ceil(100 * (minValue + (maxValue - minValue) / 10 * i)) / 100;
            textValue = value;
            if (currentFilter.substring(0, 1) === "P")
            {
                textValue += " %";
            }
            else
            {
                textValue = value;
            }


            legend.append("div")
                    .style("width", "90px")
                    .style("background-color", (colorInterpolator(linearColorScale(value))))
                    .append("div")
                    .style("width", "85px")
                    .style("height", "45px")
                    .style("text-align", "right")
                    .append("text")
                    .text(textValue)
                    .style("padding-top", "40px");
        }
    }

    function mouseEnterGemeente(d)
    {
        gemeenteNaam = d.gm_naam;
        gemeenteCode = d.gm_code;
        //missing data
        var text = "";
        if (cityData.get(gemeenteCode))
        {
            var value = cityData.get(gemeenteCode)[currentFilter]
            if (value < 0)//negative value
            {
                value = "Er is geen data beschikbaar voor deze gemeente";
            }
            if (currentFilter.substring(0, 1) === "P")
            {
                value += "%";
            }
            text = "Gemeentenaam: " + gemeenteNaam + "<br />" + currentFilter + " : " + value;//displays the name            
        }
        else
        {
            text = "Gemeentenaam: " + gemeenteNaam + "<br />" + currentFilter + " : Er is geen data beschikbaar voor deze gemeente";//displays the name
        }

        toolTipdiv.transition()
                .duration(200)
                .style("opacity", .9);
        toolTipdiv.html(text)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 80) + "px");
        d3.select(this).style("opacity", 0.6);

    }

}