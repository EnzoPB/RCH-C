var charts = {};
var chartsData = {};
$(() => {
	const chartOpts = {
		responsive: true,
		tooltip: true,
		millisPerPixel: ((settings['chart-time'] - 1) * 1000) / $($('.chart')[0]).width(),
		grid: {
			fillStyle: 'rgba(0, 0, 0, 0)',
			sharpLines: true,
			millisPerLine: settings['chart-time'] * 100
		},
		minValue: 0
	};

	charts.speed = new SmoothieChart(chartOpts);
	charts.acceleration = new SmoothieChart(chartOpts);
	charts.engineSpeed = new SmoothieChart(chartOpts);
	charts.temperature = new SmoothieChart(chartOpts);

	charts.speed.streamTo($('#chart-speed')[0], settings['data-frequency']);
	charts.acceleration.streamTo($('#chart-acceleration')[0], settings['data-frequency']);
	charts.engineSpeed.streamTo($('#chart-engineSpeed')[0], settings['data-frequency']);
	charts.temperature.streamTo($('#chart-temperature')[0], settings['data-frequency']);

	charts.temperature.options.maxValue = 50;

	chartsData.speed = new TimeSeries();
	chartsData.acceleration = new TimeSeries();
	chartsData.elecEngineSpeed = new TimeSeries();
	chartsData.gasEngineSpeed = new TimeSeries();
	chartsData.elecEngineTemperature = new TimeSeries();
	chartsData.gasEngineTemperature = new TimeSeries();
	chartsData.temperature = new TimeSeries();

	const timeSeriesOpts = {
		lineWidth: 2,
		fillStyle: 'rgba(255, 255, 255, 0.3)'
	};

	charts.speed.addTimeSeries(chartsData.speed, timeSeriesOpts);
	charts.acceleration.addTimeSeries(chartsData.acceleration, timeSeriesOpts);

	charts.engineSpeed.addTimeSeries(chartsData.elecEngineSpeed, timeSeriesOpts);
	charts.engineSpeed.addTimeSeries(chartsData.gasEngineSpeed, timeSeriesOpts);

	charts.temperature.addTimeSeries(chartsData.temperature, {
		lineWidth: 2
	});
	charts.temperature.addTimeSeries(chartsData.elecEngineTemperature, {
		lineWidth: 2,
		strokeStyle: '#3498db'
	});
	charts.temperature.addTimeSeries(chartsData.gasEngineTemperature, {
		lineWidth: 2,
		strokeStyle: '#e67e22'
	});
});