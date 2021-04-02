var settings = {
	'chart-time': 30, // how much the chart go back in the time
	'chart-delay': true, // add a delay to the charts to make it looks smoother (also controls the gauges "smoothness")
	'data-frequency': 150 // this is actually not the frequency, but rather the time (in ms) between 2 telemetry request
};

$(() => {
	// apply the default settings
	$(`#settings-chart-time button[data-value=${settings['chart-time']}]`).addClass('green');
	$(`#settings-chart-delay button[data-value=${settings['chart-delay']}]`).addClass('green');
	$(`#settings-data-frequency button[data-value=${settings['data-frequency']}]`).addClass('green');
});

$('#settings-chart-time button').on('click', event => { // when the chart-time setting is changed
	var target = $(event.target); // the target is the clicked button
	$('#settings-chart-time button.green').removeClass('green'); // we unselect the previously selected setting
	target.addClass('green'); // we select the new one

	settings['chart-time'] = target.data('value'); // the new setting value
	for (let chart in charts) { // apply this setting to every charts
		charts[chart].options.millisPerPixel = ((settings['chart-time'] - 1) * 1000) / $($('.chart')[0]).width(); // change the millisPerPixel which is basically the chart's scale
		charts[chart].options.grid.millisPerLine = settings['chart-time'] * 100 // change the millis per line, which is the background grid scale
	};
});

$('#settings-chart-delay button').on('click', event => { // when the chart-delay setting is changed
	var target = $(event.target); // the target is the clicked button
	$('#settings-chart-delay button.green').removeClass('green'); // we unselect the previously selected setting
	target.addClass('green'); // we select the new one

	settings['chart-delay'] = target.data('value'); // the new setting value
	for (let chart in charts) { // apply this to every chart
		if (settings['chart-delay']) { // if the delay is enabled
			charts[chart].delay = settings['data-frequency']; // set the delay to the frequency (see line 4) the lower the data-frequecy the faster the data arrives, so we can to shorten the delay
			$('.gauge').removeClass('without-transition'); // enable the gauge's transition
		} else { // if it is not enabled
			charts[chart].delay = 0; // set the delay to 0
			$('.gauge').addClass('without-transition'); // disable the gauge's transition
		}
	};
});

$('#settings-data-frequency button').on('click', event => { // when the data-frequency setting is changed
	var target = $(event.target); // the target is the clicked button
	$('#settings-data-frequency button.green').removeClass('green'); // we unselect the previously selected setting
	target.addClass('green'); // we select the new one

	settings['data-frequency'] = target.data('value'); // the new setting value
	if (settings['chart-delay']) { // if the delay is enabled
		for (let chart in charts) { // for every chart
			charts[chart].delay = settings['data-frequency']; // apply the new delay (see line 34)
		};
	}
	clearInterval(requestTelemetry); // remove the current telemetry loop
	updateTelemetry(); // create the new one with the new refresh interval
});