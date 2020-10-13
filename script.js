d3.csv("wealth-health-2014.csv", d3.autoType).then((data) => {
  console.log(data);

  const margin = { top: 20, left: 20, bottom: 20, right: 20 };
  const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.Income))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.LifeExpectancy))
    .range([height, 0]);

  const ordinalColorScale = d3.scaleOrdinal(d3.schemeTableau10);

  const xAxis = d3.axisBottom().scale(xScale).ticks(5, "s");

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

  const yAxis = d3.axisLeft().scale(yScale).ticks(5, "s");

  svg.append("g").attr("class", "axis y-axis").call(yAxis);

  svg
    .selectAll("circles")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "income")
    .attr("r", (d) =>
      d.Population < 75000000 ? 4 : d.Population < 300000000 ? 8 : 16
    )
    .attr("stroke", "black")
    .attr("opacity", 1)
    .attr("fill", (d) => ordinalColorScale(d.Region))
    .attr("cx", (d) => xScale(d.Income))
    .attr("cy", (d) => yScale(d.LifeExpectancy))
    .on("mouseenter", (event, d) => {
      const pos = d3.pointer(event, window);
      d3
        .select(".tooltip")
        .style("position", "fixed")
        .style("left", pos[0] + 10 + "px")
        .style("top", pos[1] + 10 + "px")
        .style("padding", 2 + "px")
        .style("background", "lightsteelblue")
        .style("border-radius", 8 + "px")
        .style("font-size", "10px")
        .style("display", "block").html(`
  
  <div>
  <span>
  Country:</span>
  <span>
  ${d.Country}</span>
  </div>
  
  <div>
  <span>
  Region:</span>
  <span>
  ${d.Region}</span>
  </div>
  
  <div>
  <span>
  Population:</span>
  <span>
  ${d3.format(",.2r")(d.Population)}</span>
  </div>
  
  <div>
  <span>
  Income:</span>
  <span>
  ${"$" + d3.format(",.2r")(d.Income)}</span>
  </div>
  
  <div>
  <span>
  Life Expectancy:</span>
  <span>
  ${d.LifeExpectancy}</span>
  </div>
  
  
  
  `);
    })
    .on("mouseleave", (event, d) => {
      d3.select(".tooltip").style("display", "none");
    });

  svg
    .append("text")
    .attr("x", width - 60)
    .attr("y", height - 10)
    .text("Income");

  svg
    .append("text")
    .attr("x", 10)
    .attr("y", 5)
    .text("Life Expectancy")
    .style("writing-mode", "vertical-lr");

  const regions = new Set(data.map((d) => d.Region));
  console.log(regions);
  legendPos = [width - 125, height - 125];
  svg
    .append("g")
    .selectAll("squares")
    .data(regions)
    .enter()
    .append("rect")

    .attr("width", 10)
    .attr("height", 10)
    .attr("x", width - 120)
    .attr("y", (d, i) => height + i * 20 - 185)
    .attr("fill", (d) => ordinalColorScale(d));

  svg
    .append("g")
    .selectAll("legendTags")
    .data(regions)
    .enter()
    .append("text")
    .attr("x", width - 105)
    .attr("y", (d, i) => height + i * 20 - 176)
    .text((d) => d)
    .attr("font-size", "10px");
});
