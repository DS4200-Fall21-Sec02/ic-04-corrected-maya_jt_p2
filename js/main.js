// write your javascript code here.
// feel free to change the pre-set attributes as you see fit

let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 35
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

//SVG that will hold the visualization 
let svg1 = d3.select('#d3-container')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '60%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', 'white') 
  .style('border', 'solid')
  .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

//https://observablehq.com/@bsaienko/animated-bar-chart-with-tooltip
//Used this website to create tooltip
let tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3-tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff')
    .text('a simple tooltip');

function update(Sorting) {
  d3.csv("data/data.csv").then(function(data) {
    svg1.selectAll("g > *").remove();

    if (Sorting == 'ascending') {
      data.sort(function(b, a) {
        return  b.Y - a.Y; });
      } else if (Sorting == 'alphabet') {
        data.sort(function(a, b){
          if(a.X < b.X) { return -1; }
          if(a.X > b.X) { return 1; }
          return 0;})
        }

    const x = d3.scaleBand()
        .domain(list)
        .range([0, width + 30])
        .padding(1,2);

        svg1.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        const y = d3.scaleLinear()
        .domain([0,100])
        .range([height, 0]);

        svg1.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.X))
        .attr("y", d => y(d.Y))
        .transition()
        .duration(750)
        .attr("width", x.bandwidth())
        .attr("height", d => height  - y(d.Y))
        .attr("fill", "#ff0000");

        svg1.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
         .attr("transform", d => `translate(${x0(d[data.columns[0]])},0)`)
            .selectAll("rect")
            .data(d => col.map(key => ({key, value: d[key]})))
            .join("rect")
            .attr("x", d => x1(d.key) + 15 + margin.left)
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height + downshift - y(d.value))
            .attr("fill",'#f57842' )
            .on('mouseover', function (d, i) {
          tooltip
            .html(
              `<div>X: ${i.value}</div><div>`
            )
            .style('visibility', 'visible');
          d3.select(this).transition().attr('fill', hoverColor);
      })
      .on('mousemove', function () {
          tooltip
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
          tooltip.html(``).style('visibility', 'hidden');
          d3.select(this).transition().attr('fill', staticColor);
      });

        //adding the x label
        svg1.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 220)
        .attr("y", height + 30)
        .text("X");

        //adding the y label
        svg1.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 10)
        .attr("x", -200)
        .attr("dy", "-2.8em")
        .attr("transform", "rotate(-90)")
        .text("Y");
      });

    };

//read data

d3.csv("data/data.csv").then(function (data) {

    const downshift = 30;

    //number of columns
    const col = data.columns.slice(1);

    //number of rows
    const r =  data.map( d => d.x);

    const list = ["A", "B", "C", "D", "E", "F", "G"]
    //x axis
    const x = d3.scaleBand()
        .domain(list)
        .range([0, width + 30])
        .padding(1,2);

    //y axis
    const y = d3.scaleLinear()
        .domain([0,100])
        .range([height, 0]);


    //place on the y axis
    svg1.append("g").attr()
    svg1.append("g")
        .attr("transform", "translate(" + margin.left + ", " + downshift + ")")
                               .call(d3.axisLeft(y));



    //X value domains
    x.domain(data.map(function(d) { return d.X; }));
    // Y value domains
    y.domain([0, 100]);

    //limit the x
    let x0 = d3.scaleBand()
        .domain(data.map (d => d[data.columns[0]]))
        .rangeRound([0, width])
        .paddingInner(0.1);

    let x1 = d3.scaleBand()
        .domain(col)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);


    xAxis = g => g
     .attr("transform", `translate(35, ${height + downshift})`)
        .call(d3.axisBottom(x).tickSize(0));
             svg1.append("g")
      .call(xAxis);


//https://observablehq.com/@bsaienko/animated-bar-chart-with-tooltip
//Used this website for hovering over bar.
     svg1.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
         .attr("transform", d => `translate(${x0(d[data.columns[0]])},0)`)
            .selectAll("rect")
            .data(d => col.map(key => ({key, value: d[key]})))
            .join("rect")
            .attr("x", d => x1(d.key) + 15 + margin.left)
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height + downshift - y(d.value))
            .attr("fill",'#f57842' )
            .on('mouseover', function (d, i) {
          tooltip
            .html(
              `<div>X: ${i.value}</div><div>`
            )
            .style('visibility', 'visible');
          d3.select(this).transition().attr('fill', hoverColor);
      })
      .on('mousemove', function () {
          tooltip
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
          tooltip.html(``).style('visibility', 'hidden');
          d3.select(this).transition().attr('fill', staticColor);
      });


})
