function initLocal() {
	jq_hdr_year_label.text(years[current_year_index]);
	jq_hdr_filter_label.text(services[current_service].title);
	
	buildServiceSelect(d3.select("#service_select"), services_filter_tree, "");
	$("#service_select").change(function() {
		if (year_playing) stopYear();
		current_service = this.value;
		jq_hdr_filter_label.text(services[current_service].title);
		icicles.update();
	});			
	
	icicles.setTree(payers_tree);
	icicles.setLabelFunction(function(d) {
		return	payers[d.data.key].title + ": $" + formatSpending(d.value) + "M"
					+ " (" + formatPercent(d.value / (spending_data[years[current_year_index]][current_service][current_payer] )) + ")";
	});
	icicles.setValueFunction(function(d) {
		return spending_data[years[current_year_index]][current_service][d.key] === undefined ? 
				0 : spending_data[years[current_year_index]][current_service][d.key];
	});		
}

function buildServiceSelect(services_select, service_node, option_prefix) {
	_.each(service_node, function(service, service_id) {
		services_select.append("option")
			.attr("value", service_id)
			.text((option_prefix !== "" ? option_prefix + " " : "") + services[service_id].title);
	 	if (service !== null) buildServiceSelect(services_select, service, option_prefix + "-");
	});
}