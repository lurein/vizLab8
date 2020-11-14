d3.csv('driving.csv', d3.autoType).then(data => {
	console.log(data)

	const margin = ({top: 20, right: 20, bottom: 20, left: 60});
	const width = 700 - margin.left - margin.right;
	const height = 700 - margin.top - margin.bottom;
	const svg = d3.select('.customChart')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		const xScale = d3
		.scaleLinear()
		.range([0, width])
		.domain([d3.min(data, function(d) { return d.miles; }), d3.max(data, function(d) { return d.miles; })]).nice()

		const yScale = d3
		.scaleLinear()
		.range([height, 0])
		.domain([d3.min(data, function(d) { return d.gas; }), d3.max(data, function(d) { return d.gas; })]).nice()

		// drawing the x-axis
		const xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(width / 80)

		var bottomAxis = svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", `translate(0, ${height})`)
		.call(xAxis);

		const yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(null, "$.2f")

		var leftAxis = svg.append("g")
		.attr("class", "axis y-axis")
		.attr("transform", `translate(0, 0)`)
		.call(yAxis);


		svg.append("g")
			.attr("fill", "white")
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.selectAll("circle")
			.data(data)
			.join("circle")
			.attr("cx", d => xScale(d.miles))
			.attr("cy", d => yScale(d.gas))
			.attr("r", 3);

		svg.append("g")
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.selectAll("g")
			.data(data)
			.join("g")
			.attr("transform", d => `translate(${xScale(d.miles)},${yScale(d.gas)})`)
			.append("text").text(d => d.year)
			.each(position)
			.call(halo);
		
		bottomAxis.select(".domain").remove()
		leftAxis.select(".domain").remove()

		bottomAxis.selectAll(".tick line")
			.clone()
			.attr("y2", -height)
			.attr("stroke-opacity", 0.1) // make it transparent 

		leftAxis.selectAll(".tick line")
			.clone()
			.attr("x2", width)
			.attr("stroke-opacity", 0.1) // make it transparent 

		bottomAxis.call(g => g.append("text")
			.attr("x", width - 4)
			.attr("y", -4)
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.attr("fill", "black")
			.text("Miles per person per year")
			.call(halo)
		)

		leftAxis.call(g => g.append("text")
			.attr("x", 4)
			// .attr("y", -4)
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			.attr("fill", "black")
			.text("Cost per gallon")
			.call(halo)
		)

		const line = d3
			.line()
			.x(d => xScale(d.miles))
			.y(d => yScale(d.gas))

		
		svg.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", 1.5)
		.attr("d", line)

		function position(d) {
			const t = d3.select(this);
			switch (d.side) {
				case "top":
				t.attr("text-anchor", "middle").attr("dy", "-0.7em");
				break;
				case "right":
				t.attr("dx", "0.5em")
					.attr("dy", "0.32em")
					.attr("text-anchor", "start");
				break;
				case "bottom":
				t.attr("text-anchor", "middle").attr("dy", "1.4em");
				break;
				case "left":
				t.attr("dx", "-0.5em")
					.attr("dy", "0.32em")
					.attr("text-anchor", "end");
				break;
			}
			}


		function halo(text) {
			text
			  .select(function() {
				return this.parentNode.insertBefore(this.cloneNode(true), this);
			  })
			  .attr("fill", "none")
			  .attr("stroke", "white")
			  .attr("stroke-width", 4)
			  .attr("stroke-linejoin", "round");
		  }
	})