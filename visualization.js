var dataset  = [],
	activatedColumns = [],
	/*Width and height*/
	w = 630,
	h = 200,
	barPadding = 5,
	padding = 60,
    duration = 500,
    grouped = false;

var yScale, svg, groups;
var stack = d3.layout.stack();
var cityData = d3.map();
var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
	/*menRow.each(function() {
		d3.select(this).selectAll("td").each(function() { 
			menArray.push(parseInt(d3.select(this).text()));
		})
	});

	womenRow.each(function() {
		d3.select(this).selectAll("td").each(function() { 
			womenArray.push(parseInt(d3.select(this).text()));
		})
	});

	for (var i = 0; i < menArray.length; i++) {
		var newObject = {};
		newObject.x = i;
		newObject.y = menArray[i];
		menObjectArray.push(newObject);
	};

	for (var i = 0; i < womenArray.length; i++) {
		var newObject = {};
		newObject.x = i;
		newObject.y = womenArray[i];
		womenObjectArray.push(newObject);
	};

	dataset.push(menObjectArray);
	dataset.push(womenObjectArray);
*/
function draw() {
    dataset  = [];
    stack = d3.layout.stack();
    var elements = document.getElementsByTagName("svg");
    for (var ix = 0; ix < elements.length; ix++) {
        elements[ix].parentNode.removeChild(elements[ix]);
    }
    
    var rray0 = [], rray15 = [], rray25 = [], rray45 = [], rray65 = [];
    for (var i = 0; i < activatedColumns.length; i++) {
        var newObject0 = {}, newObject15 = {}, newObject25 = {}, newObject45 = {}, newObject65 = {};        
        newObject0.x=i;
        newObject15.x=i;
        newObject25.x=i;
        newObject45.x=i;
        newObject65.x=i;
        
        newObject0.y=parseInt(cityData.get(activatedColumns[i])[1]);
        newObject15.y=parseInt(cityData.get(activatedColumns[i])[2]);
        newObject25.y=parseInt(cityData.get(activatedColumns[i])[3]);
        newObject45.y=parseInt(cityData.get(activatedColumns[i])[4]);
        newObject65.y=parseInt(cityData.get(activatedColumns[i])[5]);
        
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

	/* Add a group for each row of data */
	groups = svg.selectAll("g")
		.data(dataset)
		.enter()
		.append("g")
		.style("fill", function(d, i) {
			return	colors[i]; 
		});		

	groups.selectAll("rect")
		.data(function(d) {
            //console.log(d);
            return d; })
		.enter()
		.append("rect")
		.attr("x", function(d, i){
        console.log(d);
			return i * (w / dataset[0].length); 
		})
		.attr("y", function(d){
			return yScale(d.y) + yScale(d.y0) - h; 
		})
		.attr("width", w / dataset[0].length - barPadding )
		.attr("height", function(d){
			return h - yScale(d.y);
		})
		.on("mouseover", function(d) {
            console.log(d);
			/* Get this bar's x/y values, then augment for the tooltip */
			var xPosition,
			yPosition = parseInt(d3.select(this).attr("y"));

			if (d3.select(this).attr("x") < 350) {

        if (grouped) { 
            console.log("We be grouped!");
            xPosition = parseFloat(d3.select(this).attr("x")) + 14;
          } else  { 
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
				.select(".value")
				.text(d.y);

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
  } else  {
    grouped = false;
    transitionStacked();
  }
}

var transitionGrouped = function() {
	groups.selectAll("rect")
		.transition()
		.duration(duration)
    .delay(function(d, i) { return i / dataset[0].length * duration; })
		.attr("width", (w / dataset[0].length - barPadding) / 5 )
		.transition()
		.duration(duration)
		.attr("x", function(d, i, j){
			return i * (w / dataset[0].length) + ((w / dataset[0].length - barPadding)/5) * j ; 
		})
		.transition()
    .duration(duration)
		.attr("y", function(d, i, j){
			return yScale(d.y); 
		});
};

var transitionStacked = function() {
	groups.selectAll("rect")
		.transition()
    .duration(duration)
    .delay(function(d, i) { return i / dataset[0].length * duration; })
		.attr("y", function(d){
			return yScale(d.y) + yScale(d.y0) - h; 
		})
		.transition()
		.duration(duration)
		.attr("x", function(d, i){
			return i * (w / dataset[0].length); 
		})
		.transition()
		.duration(duration)
		.attr("width", w / dataset[0].length - barPadding );
};

queue()
  .defer(d3.json, "cities-geometry.json")
   .defer(d3.tsv, "cities-data.txt")
   .await(dataLoaded);

function dataLoaded(error, mapData, newCityData) {
    console.log(cityData);
    //console.log(newCityData);
    newCityData.forEach(function(v,k){
        
        cityData.set(v.Code, [v.Naam, v.P_00_14_JR, v.P_15_24_JR, v.P_25_44_JR, v.P_45_64_JR, v.P_65_EO_JR]);
    });
        console.log(cityData.size());
}

    function addColumn(code) {
      if(!cityData.has(code)) {
        console.log(code + " is not in the cityData, unable to add column");   
      }
    else if(activatedColumns.indexOf(code) > -1) {
       console.log('is al toegevoegd');
    }
    else {
        activatedColumns.push(code);
        draw();
    }
    }
    function removeColumn(code) {
    if(activatedColumns.indexOf(code) <= -1) {
       console.log(code + " is not activated");
       
    }
else {
    var index = activatedColumns.indexOf(code);
    if (index > -1) {
        activatedColumns.splice(index, 1);
        draw();
    }
    else {
     console.log('Could not remove ' + code);   
    }
}
    }
    //var maxValue = d3.max(cityData.values());
    //console.log("The maximum value is " + maxValue);

