var svgWidth = 850;
var svgHeight = 550;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.95,
      d3.max(healthData, d => d[chosenXAxis]) *1.05
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) *1.1
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomXAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomXAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftYAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftYAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]))

  return circlesGroup;
  
}

// function used for updating circles text with a transition to new circles
function renderAbbr(circlesAbbr, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesAbbr.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]) - 8)
    .attr("dy", d => newYScale(d[chosenYAxis]) + 5)

  return circlesAbbr;
  
}

// function used for updating circles group with new tooltip
function updateToolTipC(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age (Median):";
  }
  else{
    var xlabel = "Household Income (Median):"
  }

  if (chosenYAxis === "healthcare") {
    var ylabel = "Lacks Healthcare %:";
  }
  else if (chosenYAxis === "smokes") {
    var ylabel = "Smokes %:";
  }
  else{
    var ylabel = "Obesity %:"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;

}

// function used for updating circles text with new tooltip
function updateToolTipA(chosenXAxis, chosenYAxis, circlesAbbr) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age (Median):";
  }
  else{
    var xlabel = "Household Income (Median):"
  }

  if (chosenYAxis === "healthcare") {
    var ylabel = "Lacks Healthcare %:";
  }
  else if (chosenYAxis === "smokes") {
    var ylabel = "Smokes %:";
  }
  else{
    var ylabel = "Obesity %:"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesAbbr.call(toolTip);

  circlesAbbr.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesAbbr;

}

// Retrieve data from the CSV file and execute everything below
d3.csv("StarterCode/assets/data/data.csv", function(err, healthData) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(healthData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);


  var biggroup = chartGroup.selectAll("circle").data(healthData).enter()
  // append initial circles
  var circlesGroup = biggroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "lightblue")
    .attr("opacity", "1")
  
  var circlesAbbr = biggroup.append("text")
    .text(function(d) {return d.abbr})
    .attr("dx", d => xLinearScale(d[chosenXAxis] - .15))
    .attr("dy", d => yLinearScale(d[chosenYAxis] - .19))
    .attr("fill", "white")
    .attr("font-size", 12)

  // Create group for  3 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for  3 y- axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(0, 0)`);

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 60 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTipC(chosenXAxis, chosenYAxis, circlesGroup);
  var circlesAbbr = updateToolTipA(chosenXAxis, chosenYAxis, circlesAbbr);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xvalue = d3.select(this).attr("value");
      if (xvalue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xvalue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circlesAbbr = renderAbbr(circlesAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTipC(chosenXAxis, chosenYAxis, circlesGroup);
        circlesAbbr = updateToolTipA(chosenXAxis, chosenYAxis, circlesAbbr);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
        }
      }
    });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("value");
      if (yvalue !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = yvalue;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circlesAbbr = renderAbbr(circlesAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTipC(chosenXAxis, chosenYAxis, circlesGroup);
        circlesAbbr = updateToolTipA(chosenXAxis, chosenYAxis, circlesAbbr);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        else if (chosenYAxis === "smokes") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        else {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
          }
      }
    });
  });