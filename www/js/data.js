var warningAudio = new Audio('assets/warning.mp3');

$(() => {
	updateTelemetry();
});
var requestTelemetry;
var lastTelemetry = { // Initial telemtry, used to compare to the fresh telemetry to avoid updating data if it hasn't changed (everything to -1 at the beginning to make sure it updates the first time)
	speed: -1,
	accelerationX: -1,
	accelerationY: -1,
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

			var acceleration = data.accelerationX + data.accelerationY;
			if (lastTelemetry.acceleration != acceleration) {
				setGauge('acceleration', acceleration * 5);
				setTelemetry('acceleration', acceleration);
			}
			setChart('acceleration', acceleration);

			setAccelerationGraph(data.accelerationX, data.accelerationY);

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

function checkTelemetry(data) {}

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

function setAccelerationGraph(valueX, valueY) {
	px = valueX * 20 + 200;
	py = valueY * 20 + 200;
	accelerationGraphRedraw();
}


var px;
var py;
var accelerationGraphRedraw;
var accelerationGraph = p => {
	let mx;
	let my;
	let s = 0.9;
	let bg;

	p.setup = () => {
		p.createCanvas(400, 400);
		p.noLoop();
		mx = p.width*0.5;
		my = p.height*0.5;
		px = mx;
		py = my;

		bg = p.loadImage('img/accelerationGraphBackground.png');
		p.fill(255);
		p.stroke(255);

	}

	accelerationGraphRedraw = () => {
		p.redraw();
	}
	
	p.draw = () => {
		//p.background(42);
		p.clear();
		p.background(bg);
	
		p.scale(s);
		p.translate((p.height-p.height * s) / 2, (p.width-p.width * s) / 2);
		/*p.fill(0, 0, 0, 0);
		p.stroke(180);
		p.ellipse(mx, my, p.height*0.2, p.width*0.2);
		p.ellipse(mx, my, p.height*0.4, p.width*0.4);
		p.ellipse(mx, my, p.height*0.6, p.width*0.6);
		p.ellipse(mx, my, p.height*0.8, p.width*0.8);
		p.ellipse(mx, my, p.height, p.width);
		p.fill(255);
		p.ellipse(mx, my, 5, 5);
		p.textAlign(p.CENTER, p.BOTTOM);
		p.text('0G', mx, my);
		p.text('0.5G', mx, my-p.height*0.1);
		p.text('1G', mx, my-p.height*0.2);
		p.text('1.5G', mx, my-p.height*0.3);
		p.text('2G', mx, my-p.height*0.4);
		p.text('2.5G', mx, my-p.height*0.5);*/
	
		p.line(mx, my, px, py);
		p.ellipse(px, py, 10, 10);
	}
}
new p5(accelerationGraph, 'accelerationGraph');