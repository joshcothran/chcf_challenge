function IciclesVisualization(container_id) {
	var FONT_SIZE = 12
	var color = d3.scale.category20c();
	
	var getWidth = function() {return 960; }
	var getHeight = function() {return 500; }
	var getLabel = function(d) {return d.data.key; }
	var getRectHeight = function(d) {
		var h = y(d.x + d.dx) - y(d.x);
		if ((d.value > 0) && (h < 2)) h = 2;
		return h; 		
	}
	var getValue = function(){return d.value;}
	var getChildren = function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; }
	var sortFunction = function(a, b){return b.value - a.value;}

	var tree;
	var x;
	var y;
	var vis = d3.select("#" + container_id).append("svg:svg");
	var partition;
	var partition_data;
	var label_text;
	var bg_rect;
	var target_rect;
	
	var x_domain_min = 0;
	var x_range_min_test = 0;
	var y_domain_min = 0;
	var y_domain_max = 1;
	
	var transition_duration = 750;
	
	this.render = function() {
		x = d3.scale.linear().range([0, getWidth()]);
		y = d3.scale.linear().range([0, getHeight()]);
		
		x.domain([x_domain_min, 1]);
		x.range([x_range_min_test ? 20 : 0, getWidth()]);
		y.domain([y_domain_min, y_domain_max]);
		
		
		vis.attr("width", getWidth());
		vis.attr("height", getHeight());
		
		partition = d3.layout.partition()
		    .children(getChildren)
		    .value(getValue)
		    .sort(sortFunction);
		    
		partition_data = partition(d3.entries(tree)[0]);
		
		bg_rect = renderRect("bg-rect");
		label_text = vis.selectAll("text")
				.data(partition_data)
			.enter().append("text")
				.attr("font-size", FONT_SIZE + "px")
				.attr("x", function(d) { return x(d.y + d.dy / 2); })
				.attr("y", function(d) { return y(d.x + d.dx / 2) + FONT_SIZE / 2 - 2; })
				.attr("text-anchor", "middle")
				.attr("fill", "#fff")
				.text(function(d) {return getLabel(d);})
				.attr("fill-opacity", function(d) {return y(d.x + d.dx) - y(d.x) < FONT_SIZE ? 0.0: 1.0});
		target_rect = renderRect("target-rect")
				.attr("fill-opacity", 0.0)
				.attr("stroke-opacity", 0.0)
				.on("click", function(d) { if(d.children) click(d);})
				.on("mouseover", function(d) {if (y(d.x + d.dx) - y(d.x) < FONT_SIZE) tooltip.show(getLabel(d), 200);})
				.on("mouseout", function(d) {tooltip.hide();});
	}
	
	this.resize = function() {
		x = d3.scale.linear().range([0, getWidth()]);
		y = d3.scale.linear().range([0, getHeight()]);
		
		x.domain([x_domain_min, 1]);
		x.range([x_range_min_test ? 20 : 0, getWidth()]);
		y.domain([y_domain_min, y_domain_max]);
		
		vis.attr("width", getWidth());
		vis.attr("height", getHeight());
		
		resizeRect(bg_rect);
		label_text
			.attr("x", function(d) { return x(d.y + d.dy / 2); })
			.attr("y", function(d) { return y(d.x + d.dx / 2) + FONT_SIZE / 2 - 2; })
			.attr("fill-opacity", function(d) {return y(d.x + d.dx) - y(d.x) < FONT_SIZE ? 0.0: 1.0});
		resizeRect(target_rect);
	}

	this.update = function() {
		partition_data = partition(d3.entries(tree)[0]);
		bg_rect.data(partition_data);
		label_text.data(partition_data);
		target_rect.data(partition_data);
		
		x_domain_min = 0;
		x_range_min_test = 0;
		y_domain_min = 0;
		y_domain_max = 1;
		
		x = d3.scale.linear().range([0, getWidth()]);
		y = d3.scale.linear().range([0, getHeight()]);
		
		x.domain([x_domain_min, 1]);
		x.range([x_range_min_test ? 20 : 0, getWidth()]);
		y.domain([y_domain_min, y_domain_max]);
		
		transitionRect(bg_rect);
		transitionText(label_text);
		transitionRect(target_rect);
	}

	function click(d) {
		tooltip.hide();
		
		x_domain_min = d.y;
		x_range_min_test = d.y;
		y_domain_min = d.x;
		y_domain_max = d.x + d.dx;
		
		x.domain([x_domain_min, 1]);
		x.range([x_range_min_test ? 20 : 0, getWidth()]);
		y.domain([y_domain_min, y_domain_max]);
		
		transitionRect(bg_rect);
		transitionText(label_text);
		transitionRect(target_rect);
	}
	
	function renderRect(rect_class) {
		return vis.selectAll("rect." + rect_class)
				.data(partition_data)
			.enter().append("rect")
				.attr("class", function(d) { return d.children ? "parent" : "child"; })
				.classed(rect_class, true)
				.attr("x", function(d) { return x(d.y); })
				.attr("y", function(d) { return y(d.x); })
				.attr("width", function(d) { return x(d.y + d.dy) - x(d.y); })
				.attr("height", function(d) {return getRectHeight(d);})
				.attr("fill", function(d) {
					return color(d.data.key);
				})
				.attr("stroke", "#fff")
				.attr("stroke-width", "1px");		
	}
	
	function resizeRect(rect) {
		rect
			.attr("x", function(d) { return x(d.y); })
			.attr("y", function(d) { return y(d.x); })
			.attr("width", function(d) { return x(d.y + d.dy) - x(d.y); })
			.attr("height", function(d) { return getRectHeight(d); });		
	}
	
	function transitionRect(rect) {
		rect.transition()
			.duration(transition_duration)
			.attr("x", function(d) { return x(d.y); })
			.attr("y", function(d) { return y(d.x); })
			.attr("width", function(d) { return x(d.y + d.dy) - x(d.y); })
			.attr("height", function(d) { return getRectHeight(d); });		
	}	
	
	function transitionText(text) {
		text.transition()
			.duration(transition_duration)
			.text(function(d) {return getLabel(d);})
			.attr("x", function(d) { return x(d.y + d.dy / 2); })
			.attr("y", function(d) { return y(d.x + d.dx / 2) + FONT_SIZE / 2 - 2; })
			.attr("fill-opacity", function(d) {return y(d.x + d.dx) - y(d.x) < FONT_SIZE ? 0.0: 1.0});
	}
	
	this.setTree = function(_tree) { tree = _tree; }
	this.setWidthFunction = function(_fn) { getWidth = _fn; }
	this.setHeightFunction = function(_fn) {getHeight = _fn; }
	this.setLabelFunction = function(_fn) {getLabel = _fn}
	this.setChildrenFunction = function(_fn) {getChildren = _fn}
	this.setValueFunction = function(_fn) {getValue = _fn}
	this.setSortFunction = function(_fn) {sortFunction = _fn}
	this.setTransitionDuration = function(_duration) {transition_duration = _duration}
}