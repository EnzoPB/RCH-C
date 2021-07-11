var warningAudio = new Audio('assets/warning.mp3');

$(() => {
	updateTelemetry();
});
var requestTelemetry;
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
	requestTelemetry = setInterval(() => {
		ipcRenderer.send('getTelemetry');
		ipcRenderer.on('telemetry', (event, data) => {
			checkTelemetry(data); // Check the telemetry data for any errors
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
						$('#state-container').addClass('error');
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

			if (lastTelemetry.controlGasThrottle != data.controlGasThrottle) {
				setGauge('controlGasThrottle', data.controlGasThrottle);
				setTelemetry('controlGasThrottle', data.controlGasThrottle)
			}
			setChart('controlGasThrottle', data.controlGasThrottle);

			if (lastTelemetry.controlElecThrottle != data.controlElecThrottle) {
				setGauge('controlElecThrottle', data.controlElecThrottle);
				setTelemetry('controlElecThrottle', data.controlElecThrottle)
			}
			setChart('controlElecThrottle', data.controlElecThrottle);

			lastTelemetry = data;
		});
	}, settings['data-frequency']);
}

function checkTelemetry(data) {
	if (data.speed < 0 || data.speed > 70) {
		setError('speed', 'error');
	} else {
		setError('speed', 'normal');
	}

	if (data.acceleration < -35 || data.acceleration > 35) {
		setError('acceleration', 'error');
	} else {
		setError('acceleration', 'normal');
	}

	if (data.temperature < 5 || data.temperature > 100) {
		setError('temperature', 'error');
	} else {
		setError('temperature', 'normal');
	}

	if (data.gasEngineSpeed < 0 || data.gasEngineSpeed > 2000) {
		setError('gasEngineSpeed', 'error');
	} else {
		setError('gasEngineSpeed', 'normal');
	}

	if (data.gasEngineTemperature < 5 || data.gasEngineTemperature > 90) {
		setError('gasEngineTemperature', 'error');
	} else {
		setError('gasEngineTemperature', 'normal');
	}

	if (data.elecEngineSpeed < 0 || data.elecEngineSpeed > 2000) {
		setError('elecEngineSpeed', 'error');
	} else {
		setError('elecEngineSpeed', 'normal');
	}

	if (data.elecEngineTemperature < 5 || data.elecEngineTemperature > 90) {
		setError('elecEngineTemperature', 'error');
	} else {
		setError('elecEngineTemperature', 'normal');
	}

	if (data.controlThrottle < 0 || data.controlThrottle > 100) {
		setError('controlThrottle', 'error');
	} else {
		setError('controlThrottle', 'normal');
	}

	if (data.controlGasThrottle < 0 || data.controlGasThrottle > 100) {
		setError('controlGasThrottle', 'error');
	} else {
		setError('controlGasThrottle', 'normal');
	}

	if (data.controlElecThrottle < 0 || data.controlElecThrottle > 100) {
		setError('controlElecThrottle', 'error');
	} else {
		setError('controlElecThrottle', 'normal');
	}

	if (data.controlSteering < -100 || data.controlSteering > 100) {
		setError('controlSteering', 'error');
	} else {
		setError('controlSteering', 'normal');
	}
}

function setError(dataIndex, severity) {
	let element = $(`.dataIndex-${dataIndex}`);
	if (!element.hasClass(severity)) {
		element.removeClass();
		element.addClass(severity);
	}
}
// Functions for the frontend, using vanilla js because we are calling those function several times per second, so they need to be quick (using jQuery would be too slow, and kinda useless)

function setGauge(gauge, value) { // Change the gauge value
	document.getElementById(`gauge-${gauge}`).style.width = `${Math.round(Math.abs(value))}%`; // absolute value because the gauge cannot go to the left
}

function setTelemetry(telemetry, value) { // Change the raw telemetry value
	document.getElementById(`telemetry-${telemetry}`).textContent = value;
}

function setChart(dataName, value) {
	chartsData[dataName].append(new Date().getTime(), value);
}