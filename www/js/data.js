var warningAudio = new Audio('assets/warning.mp3');

$(() => {
	updateTelemetry();
});
var a;

function updateTelemetry() {
	a = setInterval(() => {
		ipcRenderer.send('getTelemetry');
		ipcRenderer.on('telemetry', (event, data) => {
			switch (data.state) { // 0=initializing 1=ready 2=running 3=halted 4=fatal
				case 0:
					$('#state').text('INITIALIZING');
					$('#state-container').removeClass();
					$('#state-container').addClass('gray');
					break;
				case 1:
					$('#state').text('READY');
					$('#state-container').removeClass();
					$('#state-container').addClass('green');
					break;
				case 2:
					$('#state').text('RUNNING');
					$('#state-container').removeClass();
					$('#state-container').addClass('blue');
					break;
				case 3:
					$('#state').text('HALTED');
					$('#state-container').removeClass();
					$('#state-container').addClass('orange');
					break;
				case 4:
					$('#state').text('FATAL');
					$('#state-container').removeClass();
					$('#state-container').addClass('red');
					break;
			}

			setGauge('speed', data.speed);
			setTelemetry('speed', data.speed);
			setChart('speed', data.speed);

			setGauge('acceleration', data.acceleration);
			setTelemetry('acceleration', data.acceleration);
			setChart('acceleration', data.acceleration);

			setGauge('temperature', data.temperature);
			setTelemetry('temperature', data.temperature);
			setChart('temperature', data.temperature);

			setGauge('elecEngineTemperature', data.elecEngineTemperature);
			setTelemetry('elecEngineTemperature', data.elecEngineTemperature);
			setGauge('elecEngineSpeed', data.elecEngineSpeed);
			setTelemetry('elecEngineSpeed', data.elecEngineSpeed);

			setGauge('gasEngineTemperature', data.gasEngineTemperature);
			setTelemetry('gasEngineTemperature', data.gasEngineTemperature);
			setGauge('gasEngineSpeed', data.gasEngineSpeed);
			setTelemetry('gasEngineSpeed', data.gasEngineSpeed);
		});
	}, 150);
}


// Functions for the frontend

function setGauge(gauge, value) {
	$(`#gauge-${gauge}`)[0].style.width = `${value}%`;
}

function setTelemetry(telemetry, value) {
	$(`#telemetry-${telemetry}`)[0].textContent = value;
}

function setChart(chart, value) {
	chartsData[chart].append(new Date().getTime(), value);
}