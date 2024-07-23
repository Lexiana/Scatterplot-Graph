// set dimensions
const width = 800,
    height = 400,
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

// create svg
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// create div for tooltip
const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

// load data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(data => {
        

        //get axis data
        const time = data.map(d => new Date(d.Seconds * 1000));
        const year = data.map(d => d.Year);

        // format data
        const timeFormat = d3.timeFormat("%M:%S");

        console.log(year);
        // create scales
        const xScale = d3.scaleLinear()
            .domain([d3.min(year) - 1, d3.max(year)+1])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleTime()
            .domain([d3.min(time), d3.max(time)])
            .range([height - margin.bottom, margin.top]);

        // create axes
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"));

        const yAxis = d3.axisLeft(yScale)
            .tickFormat(timeFormat);

        // append axes
        svg.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(xAxis)
            .attr("id", "x-axis");

        svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis)
            attr("id", "y-axis");
    });