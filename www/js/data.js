var warningAudio = new Audio('assets/warning.mp3');

$(() => {
	updateTelemetry();
});
var a;
var lastTelemetry = { // Initial telemtry, used to compare to the fresh telemetry to avoid updating data if it hasn't changed (everything to -1 at the beginning to make sure it updates the first time)
	speed: -0,
	acceleration: -1,
	temperature: -1,
	gasEngineSpeed: -1,
	gasEngineTemperature: -1,
	elecEngineSpeed: -1,
	elecEngineTemperature: -1,
	controlThrottle: -1,
	controlGasThrottle: -1,
	controlElecThrottle: -1,
	controlSteering: -1
};

function updateTelemetry() {
	a = setInterval(() => {
		ipcRenderer.send('getTelemetry');
		ipcRenderer.on('telemetry', (event, data) => {
			if (lastTelemetry.state != data.state) {
				switch (data.state) { // 0=initializing 1=ready 2=running 3=halted 4=fatal
					case 0:
						$('#state').text('INIT');
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
			}

			if (lastTelemetry.speed != data.speed) {
				setGauge('speed', data.speed);
				setTelemetry('speed', data.speed);
			}
			setChart('speed', data.speed);

			if (lastTelemetry.acceleration != data.acceleration) {
				setGauge('acceleration', data.acceleration * 5);
				setTelemetry('acceleration', data.acceleration);
			}
			setChart('acceleration', data.acceleration);

			if (lastTelemetry.temperature != data.temperature) {
				setGauge('temperature', data.temperature);
				setTelemetry('temperature', data.temperature);
			}
			setChart('temperature', data.temperature);

			if (lastTelemetry.elecEngineTemperature != data.elecEngineTemperature) {
				setGauge('elecEngineTemperature', data.elecEngineTemperature);
				setTelemetry('elecEngineTemperature', data.elecEngineTemperature);
			}
			setChart('elecEngineTemperature', data.elecEngineTemperature);

			if (lastTelemetry.elecEngineSpeed != data.elecEngineSpeed) {
				setGauge('elecEngineSpeed', data.elecEngineSpeed);
				setTelemetry('elecEngineSpeed', data.elecEngineSpeed);
			}
			setChart('elecEngineSpeed', data.elecEngineSpeed);


			if (lastTelemetry.gasEngineTemperature != data.gasEngineTemperature) {
				setGauge('gasEngineTemperature', data.gasEngineTemperature);
				setTelemetry('gasEngineTemperature', data.gasEngineTemperature);
			}
			setChart('gasEngineTemperature', data.gasEngineTemperature);

			if (lastTelemetry.gasEngineSpeed != data.gasEngineSpeed) {
				setGauge('gasEngineSpeed', data.gasEngineSpeed);
				setTelemetry('gasEngineSpeed', data.gasEngineSpeed);
			}
			setChart('gasEngineSpeed', data.gasEngineSpeed);

			lastTelemetry = data;
		});
	}, 150);
}


// Functions for the frontend, using vanilla js because we are calling those function several times per second, so they need to be quick (using jQuery would be too slow, and kinda useless)

function setGauge(gauge, value) { // Change the gauge value
	document.getElementById(`gauge-${gauge}`).style.width = `${Math.round(value)}%`;
}

function setTelemetry(telemetry, value) { // Change the raw telemetry value
	document.getElementById(`telemetry-${telemetry}`).textContent = Math.abs(value); // absolute value because the gauge cannot go to the left
}

function setChart(dataName, value) {
	chartsData[dataName].append(new Date().getTime(), value);
}