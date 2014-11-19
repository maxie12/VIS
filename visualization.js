	var dataset  = [],
	menArray  = [], 
	womenArray = [],
	menObjectArray = [],
	womenObjectArray = [],
	stack = d3.layout.stack(),
  menRow = d3.selectAll("tr.men"),
	womenRow = d3.selectAll("tr.women"),
	/*Width and height*/
	w = 630,
	h = 200,
	barPadding = 5,
	padding = 60
  duration = 500,
  grouped = false;

    var cityData = d3.map();
	menRow.each(function() {
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

	stack(dataset);

	/* Define Y scale */
	var yScale = d3.scale.linear()
		.domain([0,				
			d3.max(dataset, function(d) {
				return d3.max(d, function(d) {
					return d.y0 + d.y;
				});
			})
		])
		.range([h, padding]);	

	/* Create SVG element */
	var svg = d3.select(".info-chart")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	/* Add a group for each row of data */
	var groups = svg.selectAll("g")
		.data(dataset)
		.enter()
		.append("g")
		.style("fill", function(d, i) {
			return	i === 0 ? "#E53524" : "#F8B436"; 
		});		

	groups.selectAll("rect")
		.data(function(d) { return d; })
		.enter()
		.append("rect")
		.attr("x", function(d, i){
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

			/* Get this bar's x/y values, then augment for the tooltip */
			var xPosition,
			yPosition = parseInt(d3.select(this).attr("y") );

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
		.attr("width", (w / dataset[0].length - barPadding) / 2 )
		.transition()
		.duration(duration)
		.attr("x", function(d, i, j){
			return i * (w / dataset[0].length) + ((w / dataset[0].length - barPadding)/2) * j ; 
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
   .defer(d3.tsv, "cities-data.txt")/*, function(d) { 
        cityData.set(d.Code, [d.Naam, d.P_00_14_JR, d.P_15_24_JR, d.P_25_44_JR, d.P_45_64_JR, d.P_65_EO_JR]); 
        console.log(cityData.get(d.Code));
    })*/
   .await(dataLoaded);

function dataLoaded(error, mapData, newCityData) {
    console.log(cityData);
    //console.log(newCityData);
    newCityData.forEach(function(v,k){
        
        cityData.set(v.Code, [v.Naam, v.P_00_14_JR, v.P_15_24_JR, v.P_25_44_JR, v.P_45_64_JR, v.P_65_EO_JR]);
    });
    //var maxValue = d3.max(cityData.values());
    //console.log("The maximum value is " + maxValue);
    console.log(cityData.size());
}