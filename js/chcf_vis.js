// Data
var years;
var years_data;
var payers;
var services;
var payers_tree;
var payers_filter_tree;
var services_tree;
var services_filter_tree;
var spending_data;

// Constants
var TOTAL_PAYER_ID = "p1";
var TOTAL_SERVICES_ID = "s1";

// JQuery handles
var jq_navbar;
var jq_header;
var jq_container;
var jq_chart;
var jq_btn_play_year_i;
var jq_hdr_year_label;
var jq_hdr_filter_label;

// Visualization
var icicles;
var percent_gdp_bar;
var formatSpending = d3.format(",.0f")
var formatPercent = d3.format("%")

// State variables
var current_year_index;
var current_service;
var current_payer;

// Playback control
var year_playing = false;
var year_timer = null;
var short_transition_duration = 350;
var long_transition_duration = 750;

function initGlobal() {
	// Init JQuery handles
	jq_navbar = $("#navbar");
	jq_header = $("#header");
	jq_container = $(".container");
	jq_chart = $("#chart");
	jq_btn_play_year_i = $("#btn_play_year i");
	jq_hdr_year_label = $("#hdr_year_label");
	jq_hdr_filter_label = $("#hdr_filter_label");
	
	$.getJSON('data/spending.min.json', function(data) {
		spending_data = data;

		$.getJSON('data/schema.json', function(data) {
			// Init data
			years = data.years;
			years_data = data.years_data;
			payers = data.payers;
			services = data.services;
			payers_tree = data.payers_tree;
			payers_filter_tree = data.payers_filter_tree;
			services_tree = data.services_tree;
			services_filter_tree = data.services_filter_tree;
			
			// Init state variables
			current_year_index = years.length - 1;
			current_payer = TOTAL_PAYER_ID;
			current_service = TOTAL_SERVICES_ID;
			
			// Build year select
			buildYearSelect();
			
			// Init event handlers
			initEventHandlers();		
			
			// Init icicles
			icicles = new IciclesVisualization("chart");
			initIcicles();
			
			// Init visualization-specific configuration (Payers vs. Services)
			initLocal();

			// Init tooltip
			tooltip.show("", 0);
			tooltip.hide();
			
			// Render
			icicles.render();			
			resize();
		});
	})
}

function initIcicles() {
	icicles.setWidthFunction(function() {return getChartWidth(); })
	icicles.setHeightFunction(function() {return getChartHeight(); })
	icicles.setSortFunction(function(a, b){return 0;});
	icicles.setChildrenFunction(function(d) { return d.value !== null ? d3.entries(d.value) : null; });
	icicles.setTransitionDuration(long_transition_duration);
}

function resize() {
	jq_chart.width(getChartWidth());
	jq_chart.height(getChartHeight());
	icicles.resize();
}

function getChartWidth() {
	return jq_container.width();
}

function getChartHeight() {
	return $(window).height() - jq_navbar.height() - jq_header.height();
}

function buildYearSelect() {
	var year_select = d3.select("#year_select");
	var year_options = year_select.selectAll("option")
				.data(_.clone(years).reverse())
			.enter().append("option")
				.attr("value", function(d) {return years.indexOf(d);})
				.text(function(d) {return d;});
}

function initEventHandlers() {
	$(window).resize(function() {resize();})
	
	$("#year_select").change(function() {
		current_year_index = parseInt(this.value);
		icicles.update();
	});
	
	$("#btn_play_year").click(function() {
		$("#btn_play_year i").toggleClass('icon-play');
		$("#btn_play_year i").toggleClass('icon-stop');	
		if (!year_playing) {
			playYear();
		} else {
			stopYear();
		}
	})
	
	$("#btn_prev_year").click(function() { decrementYear(); })
	$("#btn_next_year").click(function() { incrementYear(); })
}

function playYear() {
	if (jq_btn_play_year_i.hasClass('icon-play')) jq_btn_play_year_i.removeClass('icon-play');
	if (!jq_btn_play_year_i.hasClass('icon-stop')) jq_btn_play_year_i.addClass('icon-stop');	
	
	year_playing = true;
	icicles.setTransitionDuration(short_transition_duration);
	year_timer = setInterval(function() {
		incrementYear();
	}, short_transition_duration + 50);
	incrementYear();	
}

function stopYear() {
	if (jq_btn_play_year_i.hasClass('icon-stop')) jq_btn_play_year_i.removeClass('icon-stop');
	if (!jq_btn_play_year_i.hasClass('icon-play')) jq_btn_play_year_i.addClass('icon-play');	
	
	year_playing = false;
	icicles.setTransitionDuration(long_transition_duration);
	clearInterval(year_timer);
}

function incrementYear() {
	if(current_year_index + 1 < years.length) current_year_index++;
	else current_year_index = 0;
	updateCurrentYear();
}

function decrementYear() {
	if(current_year_index > 0) current_year_index--;
	else current_year_index = years.length - 1;
	updateCurrentYear();
}

function updateCurrentYear() {
	jq_hdr_year_label.text(years[current_year_index]);
	$("#year_select").val(current_year_index);
	icicles.update();
}