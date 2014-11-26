
var width = 800;
var height = 800;

var cityData = d3.map();



var linearColorScale = d3.scale.linear()
        .domain([0.0, 100.0])
        .range([0, 1])

var colorInterpolator = d3.interpolateHsl("green", "red");

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);


var mapData;

var gemeenteNaam = "Selecteer uw gemeente"
//[not selected, mouse over and not selected,selected,mouse over and selected]
var gemeenteColors = ["#F1F1F1", "#CFCFCF", "#5E5E5E", "#BBBBBB"]
//last province we clicked on. Becomes null as soon as mouse leaves the gemeente
var clickedOnGemeente = null;

var filterColors = ["#000000", "#000000", "#000000", "#000000"];//unselected,hover unselected,hover selected,selected
var currentFilter = "aant_man";
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
        .defer(d3.tsv, "cities-data.txt", function(d) {
            //cityData.set(d.Code, +d.AUTO_TOT);
        })
        .await(dataLoaded);


function dataLoaded(error, loadedMapData,cityData) {
    mapData = loadedMapData;
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
            .on("mouseenter", mouseEnterGemeente)
            .style("fill", gemeenteColors[0]);
    //initialize for the filter
    console.log(mapData.features[2].properties);
    console.log(cityData);
    for (var key in mapData.features[0].properties)
    {
        if (key !== "WATER" && key !== "gm_code" && key !== "gm_naam")
        {
            filterList.push(key);
            d3.select("#filter ").append("p")
                    .attr("id", key)
                    .text(key)
                    .style("Margin-top", '0px')
                    .style("Margin-bottom", '0px')
                    .on("mouseout", filterExit)
                    .on("mouseenter", filterEnter)
                    .on("click", filterClick);
        }
    }
    newFilter();


    function filterClick()
    {
        /*
         * Using [0][0] as 
         * console.log(d3.select("#filter h4#" + currentFilter));; gives Array [ Array[1] ]
         * console.log(d3.selectAll("#filter h4#" + currentFilter));; gives Array [ Array[1]]
         * console.log(d3.selectAll("#filter h4#" + currentFilter)[0][0].id);; gives Array [ Array[1]]
         * No idea why
         */
        //select it and unhighlight the previous selected
        d3.select("#filter p#" + currentFilter).style("font-weight", "normal");
        d3.select(this).style("font-weight", 'bold');

        currentFilter = d3.select(this)[0][0].id;
        newFilter();
    }
    function filterEnter()
    {
        /*
         * Using [0][0] as 
         * console.log(d3.select(this)); gives Array [ Array[1] ]
         * console.log(d3.selectAll(this)); gives Array [ Array[0] ]
         * console.log(d3.select(this)[0][0].id); gives "p_65_eo_jr"
         * 
         * No idea why
         */
        //if tthis is not the currentfilter
        if (currentFilter !== d3.select(this)[0][0].id)
        {
            d3.select(this).style("font-weight", "bold");

        }
        else
        {
            d3.select(this).style("font-weight", "normal");
        }
    }
    function filterExit() {
        /*
         * Using [0][0] as 
         * console.log(d3.select(this)); gives Array [ Array[1] ]
         * console.log(d3.selectAll(this)); gives Array [ Array[0] ]
         * console.log(d3.select(this)[0][0].id); gives "p_65_eo_jr"
         * 
         * No idea why
         */
        //if it was not selected
        if (currentFilter !== d3.select(this)[0][0].id)
        {
            d3.select(this).style("font-weight", "normal");
        }
        else
        {
            d3.select(this).style("font-weight", "bold");
        }
    }

    function newFilter()
    {

        var minValue = 999999999;
        var maxValue = -1;
        var average = 0;
        // console.log(currentFilter);
        //   console.log(mapData.features[0].properties[currentFilter]);
        for (var i = 0; i < mapData.features.length; i++)
        {

            var value = parseInt(mapData.features[i].properties[currentFilter]);
            average += value;
            if (value <= -99997.0)
            {

            }
            else
            {
                minValue = value < minValue ? value : minValue;
                maxValue = value > maxValue ? value : maxValue;
            }
        }
        linearColorScale = d3.scale.linear()
                .domain([minValue, maxValue])
                .range([0, 1]);

        g.selectAll("path")
                .transition()
                .duration(2000)
                .style("fill", function(d) {
                    return(colorInterpolator(linearColorScale(d.properties[currentFilter])));
                });

        //d3.select('#wtf h2').html("Gemeentenaam: " + d + "<br />" + currentFilter + " : " + d.properties[currentFilter]);//displays the name

    }
    function contained(province)
    {
        var index = gemeenteCodesSelected.indexOf(province);
        if (index === -1)
        {
            return(false);
        }
        return(true);
    }

    function mouseEnterGemeente(d)
    {

        gemeenteNaam = d.gm_naam;
        d3.select('#wtf h2').html("Gemeentenaam: " + d.gm_naam + "<br />" + currentFilter + " : " + d.properties[currentFilter]);//displays the name
    }




    function addGemeente(gemeenteNaam, gemeenteCode) {
        gemeenteCodesSelected.push(gemeenteCode);
        gemeenteNamenSelected.push(gemeenteNaam);

        updateSelected();
    }

    function removeGemeente(gemeenteNaam, gemeenteCode)
    {
        var index = gemeenteCodesSelected.indexOf(gemeenteCode);
        gemeenteCodesSelected.splice(index, 1);

        var index = gemeenteNamenSelected.indexOf(gemeenteNaam);
        gemeenteNamenSelected.splice(index, 1);

        updateSelected();
    }
    function updateSelected() {
        d3.select("#selectedGemeentes").select("table").selectAll("*").remove();
        d3.select("#selectedGemeentesUitleg").selectAll("h2").remove();
        if (gemeenteNamenSelected.length === 0)
        {
            d3.select("#selectedGemeentesUitleg").append("h2")
                    .text("Selecteer op de kaart de provincies waarin u geinteresser bent")
        }
        else
        {
            d3.select("#selectedGemeentesUitleg").append("h2")
                    .text("Uw geselecteerde provincies")

        }
        for (i = 0; i < gemeenteNamenSelected.length; i++)
        {
            var tr = d3.select("#selectedGemeentes").select("table").append("tr");
            tr.append("td").text(gemeenteNamenSelected[i]);
            tr.append("button")
                    .attr("gemeenteNaam", gemeenteNamenSelected[i])
                    .text("Haal deze gemeente weg")
                    .on("click", function() {
                        var naam = this.getAttribute("gemeenteNaam");
                        var code = nameToCode(naam);
//                    unmark the province on the map
//                    find the code so we cna unmark it on the map
                        removeGemeente(naam, code);

                        d3.selectAll("path#" + code).style("fill", gemeenteColors[0]);
                    });
        }
    }
    function nameToCode(name)
    {
        console.log("init: " + name)
        for (var i = 0; i < mapData.features.length; i++)
        {
            if (mapData.features[i].gm_naam === name)
            {
                return(mapData.features[i].gm_code);
            }
        }
        return(null);
    }
}