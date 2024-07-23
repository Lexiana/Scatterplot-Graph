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
            .attr("id", "y-axis");

        // set color variable
            const color = [
                {doping: false,
                color: "orange",
                text:"No doping allegation"},
                {doping: true,
                color: "steelblue",
                text:"Riders with doping allegations"}
            ]

        // create circles
        const circles = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.Year))
            .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
            .attr("r", 5)
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => timeFormat(new Date(d.Seconds * 1000)))
            .attr("class", "dot")
            .attr("fill", d => {
                if (d.Doping) {
                    return color[1].color
                }
                return color[0].color
            })

        // create legend
        const legendGroup = svg.append("g")
            .attr("id", "legend");

        var legend = legendGroup
            .selectAll("#legend")
            .data(color)
            .enter()
            .append("g")
            .attr("class", "legend-label")
            .attr("transform", (d, i) => `translate(0,${height / 2 -i * 20})`);

            // create legend squares
        legend.append("rect")
            .attr("x", width - 20)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", d => d.color);

            // create legend text
        legend.append("text")
            .attr("x", width - 25)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d.text);

        // add event listeners
        circles.on("mouseover", (event, d) => {

            // mouse position
            const [x, y] = d3.pointer(event, this);

            // show and place tooltip + attribute
            tooltip.style("opacity", .8)
                .transition()
                .duration(0);
            tooltip.style("left", (x + 10) + "px")
                .style("top", (y - 28) + "px")
                .attr("data-year", d.Year)

            // set tooltip html
            tooltip.html(
                `<p>${d.Name}: ${d.Nationality}</p>
                <p>Year: ${d.Year}</p>
                <p>Time: ${timeFormat(new Date(d.Seconds * 1000))}</p>
                ${d.Doping ? `<p>Doping Allegations: ${d.Doping}</p>` : ""}
                `
            )
        })
    });