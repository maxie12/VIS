
var width = 800;
var height = 800;

var cityData = d3.map();

var linearColorScale = d3.scale.linear()
        .domain([0.0, 100.0])
        .range(["white", "red"]);

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);


var mapData;

var gemeenteCodesSelected = new Array();
var gemeenteNamenSelected = new Array();

//[not selected, mouse over and not selected,selected,mouse over and selected]
var gemeenteColors = ["#F1F1F1", "#CFCFCF", "#5E5E5E", "#BBBBBB"]
//last province we clicked on. Becomes null as soon as mouse leaves the gemeente
var clickedOnGemeente = null;


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
            cityData.set(d.Code, +d.AUTO_TOT);
        })
        .await(dataLoaded);


function dataLoaded(error, loadedMapData) {
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
            .on("mouseout", mouseOutGemeente)
            .on("click", mouseClickGemeente)
            .style("fill", gemeenteColors[0]);

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
    console.log("enter");
    var gemeenteNaam = d.gm_naam;
    var gemeenteCode = d.gm_code;
    d3.select('#wtf h2').html(gemeenteNaam);//displays the name
    //don't change the color after we just clicked on this state.
    if (contained(gemeenteCode))
    {
        //make visible that it can be deselected
        d3.select(this).style("fill", gemeenteColors[3]);
    }
    else
    {
        //make visible that it can be selected
        d3.select(this).style("fill", gemeenteColors[1]);
    }
}
;
function mouseOutGemeente(d)
{
    var gemeenteCode = d.gm_code;

    if (contained(gemeenteCode))
    {
        //it was selected
        d3.select(this).style("fill", gemeenteColors[2]);
    }
    else
    {
        //it was not selected
        d3.select(this).style("fill", gemeenteColors[0]);
    }
}

function mouseClickGemeente(d)
{
    console.log("click");
    var gemeenteNaam = d.gm_naam
    var gemeenteCode = d.gm_code;

    //check if the state was already selected
    if (contained(gemeenteCode))//it was already in
    {
        removeGemeente(gemeenteNaam, gemeenteCode);
        d3.select(this).style("fill", gemeenteColors[0]);
    }
    else//it was not yet in
    {
        addGemeente(gemeenteNaam, gemeenteCode);
        d3.select(this).style("fill", gemeenteColors[2]);

    }
    console.log(gemeenteNamenSelected);
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