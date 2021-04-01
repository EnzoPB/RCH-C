var settings = {
	'chart-time': 30,
	'chart-delay': true,
	'data-frequency': 150
};

$(() => {
	$(`#settings-chart-time button[data-value=${settings['chart-time']}]`).addClass('green');
	$(`#settings-chart-delay button[data-value=${settings['chart-delay']}]`).addClass('green');
	$(`#settings-data-frequency button[data-value=${settings['data-frequency']}]`).addClass('green');
});

$('#settings-chart-time button').on('click', event => {
	var target = $(event.target);
	$('#settings-chart-time button.green').removeClass('green');
	target.addClass('green');

	settings['chart-time'] = target.data('value');
	for (let chart in charts) {
		charts[chart].options.millisPerPixel = ((settings['chart-time'] - 1) * 1000) / $($('.chart')[0]).width();
		charts[chart].options.grid.millisPerLine = settings['chart-time'] * 100
	};
});

$('#settings-chart-delay button').on('click', event => {
	var target = $(event.target);
	$('#settings-chart-delay button.green').removeClass('green');
	target.addClass('green');

	settings['chart-delay'] = target.data('value');
	for (let chart in charts) {
		if (settings['chart-delay']) {
			charts[chart].delay = settings['data-frequency'];
		} else {
			charts[chart].delay = 0;
		}
	};
});

$('#settings-data-frequency button').on('click', event => {
	var target = $(event.target);
	$('#settings-data-frequency button.green').removeClass('green');
	target.addClass('green');

	settings['data-frequency'] = target.data('value');
	if (settings['chart-delay']) {
		for (let chart in charts) {
			charts[chart].delay = settings['data-frequency'];
		};
	}
});