function initLocal() {
	jq_hdr_year_label.text(years[current_year_index]);
	jq_hdr_filter_label.text(payers[current_payer].title);
	
	buildPayerSelect(d3.select("#payer_select"), payers_filter_tree, "");
	$("#payer_select").change(function() {
		if (year_playing) stopYear();
		current_payer = this.value;
		jq_hdr_filter_label.text(payers[current_payer].title);
		icicles.update();
	});	
	
	icicles.setTree(services_tree);
	icicles.setLabelFunction(function(d) {
		var percent;
		if ((spending_data[years[current_year_index]][current_service][current_payer] === 0) || 
			(spending_data[years[current_year_index]][current_service][current_payer] === undefined) || 
			(d.value === undefined)) {
				percent = 0;	
			}
		else {
			percent = d.value / spending_data[years[current_year_index]][current_service][current_payer];
		}		
		return	services[d.data.key].title + ": $" + formatSpending(d.value) + "M"
					+ " (" + formatPercent(percent) + ")";
	});
	icicles.setValueFunction(function(d) {
		return spending_data[years[current_year_index]][d.key][current_payer] === undefined ? 
				0 : spending_data[years[current_year_index]][d.key][current_payer];
	});		
}

function buildPayerSelect(payers_select, payer_node, option_prefix) {
	_.each(payer_node, function(payer, payer_id) {
		payers_select.append("option")
			.attr("value", payer_id)
			.text((option_prefix !== "" ? option_prefix + " " : "") + payers[payer_id].title);
	 	if (payer !== null) buildPayerSelect(payers_select, payer, option_prefix + "-");
	});
}