const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron');
const path = require('path');
const SerialPort = require('serialport');
const { StringStream } = require('scramjet');

var serialport = new SerialPort('/dev/ttyUSB0', {
	baudRate: 9600,
	parser: new SerialPort.parsers.Readline('\r\n')
});

serialport.on('open', () => {
	serialport.pipe(new StringStream)
		.lines('\r\n') // read data until a new line
		.each(data => {
			processSerial(data);
		}); // process the data
});

var mainWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({ // Create the main window
		width: 1300,
		height: 720,
		minWidth: 1300,
		minHeight: 300,
		backgroundColor: '#222222',
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false
		}
	});
	mainWindow.setMenuBarVisibility(false); // hide the menu bar
	mainWindow.loadFile(path.join(__dirname, 'www', 'main.html')); // load the html document
}

function randomTelemetry(min = 0, max = 100) {
	return Math.floor(Math.random() * max) + min;
}

var lastTelemetry = { // Object that fills up with the data we receive from the transmitter
	speed: 0,
	acceleration: 0,
	accelerationX: 0,
	accelerationY: 0,
	temperature: 0,
	gasEngineSpeed: 0,
	gasEngineTemperature: 0,
	elecEngineSpeed: 0,
	elecEngineTemperature: 0,
	controlThrottle: 0,
	controlGasThrottle: 0,
	controlElecThrottle: 0,
	controlSteering: 0
};
var lastErrors = []; // This object fills up when there's errors (from the transmitter itself, or from the app)

function processSerial(data) {
	/**
	 * DATA FORMAT
	 * 
	 * "datatype:data"
	 * 
	 * Telemetry data:
	 * "data:telemetry:state,accelerationX,accelerationY,temperature"
	 * 
	 * Error:
	 * "error:severity(0-3):faultyelement:message"
	 **/
	data = data.split(':');

	switch (data[0]) {
		case 'data': // in case we receive data
			data.shift(); // the first element is "data", we can remove it
			if (data[0] == 'telemetry') { // in case we receive telemetry data
				data.shift(); // the first element is "telemetry", we can remove it
				data = data[0].split(','); // we split the different telemetry elements
				lastTelemetry = { // we update the lastTelemetry object, which will be transferred to the UI
					state: parseInt(data[0]),
					speed: randomTelemetry(),
					acceleration: parseFloat(data[1] + data[2]).toFixed(2),
					temperature: parseInt(data[3]),
					accelerationX: randomTelemetry(0, 5),
					accelerationY: randomTelemetry(0, 5),
					gasEngineSpeed: randomTelemetry(),
					gasEngineTemperature: randomTelemetry(24, 45),
					elecEngineSpeed: randomTelemetry(),
					elecEngineTemperature: randomTelemetry(24, 45),
					controlThrottle: randomTelemetry(),
					controlGasThrottle: 50,
					controlElecThrottle: 70,
					controlSteering: 10
				};

			}

			break;

		case 'error': // in case we receive an error
			data.shift(); // the first element is "error", we can remove it
			lastErrors.push({ // we append the error to the lastErrors object, which will be transferred to the UI
				severity: data[0],
				element: data[1],
				message: data[2]
			});
			break;

		default: // most likely the data is corrupted
			lastErrors.push({ // we append the error to the lastErrors object, which will be transferred to the UI
				severity: 3,
				element: 'backend',
				message: 'incorrect data received'
			});
			break;
	}
}

ipcMain.on('getTelemetry', event => { // the UI asks for the telemetry
	/*event.reply('telemetry', lastTelemetry); // we answer with the telemetry*/
	event.reply('telemetry', {
		speed: randomTelemetry(0, 56),
		acceleration: randomTelemetry(0, 5),
		accelerationX: randomTelemetry(0, 5),
		accelerationY: randomTelemetry(0, 5),
		temperature: randomTelemetry(10, 50),
		gasEngineSpeed: randomTelemetry(0, 2000),
		gasEngineTemperature: randomTelemetry(15, 65),
		elecEngineSpeed: randomTelemetry(0, 2000),
		elecEngineTemperature: randomTelemetry(15, 65),
		controlThrottle: randomTelemetry(),
		controlGasThrottle: randomTelemetry(),
		controlElecThrottle: randomTelemetry(),
		controlSteering: randomTelemetry(0, 100)
	})
});

ipcMain.on('getErrors', event => { // the UI asks for the errors
	event.reply('errors', lastErrors); // we answer with the errors list
});

app.whenReady().then(() => {
	createMainWindow(); // Create the main window
});