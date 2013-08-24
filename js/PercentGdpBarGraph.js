function PercentGdpBarGraph(container_id) {
	const FONT_SIZE = 12;
	
	var getWidth = function() { return $(".container").width(); }
	var getHeight = function() { return $("#" + container_id).height(); }
	var getValueLabel = function(year) { return years.indexOf(year); }
	var getValue = function(year){ return years.indexOf(year); }
	
	var percent_gdp = _.map(years_data, function(year_data) {return year_data.percent_gdp;});
	
	var graph_caption = "";
	var min_value = _.min(percent_gdp);
	var max_value = _.max(percent_gdp);
	var min_bound = Math.floor(min_value) - 2;
	var max_bound = Math.ceil(max_value) + 2;
	
	var margin = {top: 10, right: 10, bottom: 20, left: 40};

	var x;
	var y;
	var bar;
	
	var vis = d3.select("#" + container_id).append("svg:svg");
	var percent_gdp = _.map(years_data, function(year_data) {return year_data.percent_gdp;});
	
	x = d3.scale.linear()
			.domain([0, years.length])
			.range([0, getWidth()]);
	
	y = d3.scale.linear()
	    .domain([min_bound, max_bound])
	    .range([0, getHeight()]);


	bar = vis.selectAll("g.bar")
  		.data(years)
	    	.enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d) { 
			var dx = x(1) * years.indexOf(d);
			var bar_height = getBarHeight(d);
			var dy = getHeight() - bar_height - 1;
			return "translate("+ dx + "," + dy +")" });
	bar.append("rect")
		.attr("width", getBarWidth())
		.attr("height", function(d) { return getBarHeight(d); })
		.attr("id", function(d) {return "gdp_rect_" + d});
		
	
	this.resize = function() {
		
	}
	
	function getBarHeight(year) {
		var i = years.indexOf(year);
		var d = percent_gdp[i];
		var bar_height = y(d);
		console.log(bar_height)
		return Math.floor(bar_height);
	}
	
	function getBarWidth() {
		return Math.floor(x(1)) - 1;
	}
	
	
	this.setWidthFunction = function(_fn) { getWidth = _fn; }
	this.setHeightFunction = function(_fn) {getHeight = _fn; }
	this.setGraphCaption = function(_caption) { graph_caption = _caption; }
	this.setValueFunction = function(_fn) {getValue = _fn; }
	this.setValueLabelFunction = function(_fn) {getValueLabel = _fn; }
}
