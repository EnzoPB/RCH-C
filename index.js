const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron');
const path = require('path');
const SerialPort = require('serialport');
const { StringStream } = require('scramjet');

var serialport = new SerialPort('/dev/ttyACM0', {
	baudRate: 9600,
	parser: new SerialPort.parsers.Readline("\r\n")
});

serialport.on('open', () => {
	serialport.pipe(new StringStream)
		.lines('\r\n') // read data until a new line
		.each(data => { processSerial(data) }); // process the data
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

function randomTelemetry() {
	return Math.round(Math.random() * 100);
}

var lastTelemetry = { // Object that fills up with the data we receive from the transmitter
	speed: 0,
	acceleration: 0,
	temperature: 0,
	gasEngineSpeed: 0,
	gasEngineTemperature: 0,
	elecEngineSpeed: 0,
	elecEngineTemperature: 0,
	controlThrottle: 0,
	controlGasThrottle: 0,
	controlElecThrottle: 0,
	controlStreering: 0
};
var lastErrors = []; // This object fills up when there's errors (from the transmitter itself, or from the app)

function processSerial(data) {
	/**
	 * DATA FORMAT
	 * 
	 * "datatype:data"
	 * 
	 * Telemetry data:
	 * "data:telemetry:state,speed,accelerationX,accelerationY,accelerationZ,temperature"
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
				checkTelemetry(data); // we check the telemetry for any abnormal value
				lastTelemetry = { // we update the lastTelemetry object, which will be transferred to the UI
					state: data[0],
					speed: data[1],
					acceleration: data[2] + data[3] + data[4],
					temperature: data[5],
					gasEngineSpeed: randomTelemetry(),
					gasEngineTemperature: randomTelemetry(),
					elecEngineSpeed: randomTelemetry(),
					elecEngineTemperature: randomTelemetry(),
					controlThrottle: randomTelemetry(),
					controlGasThrottle: randomTelemetry(),
					controlElecThrottle: randomTelemetry(),
					controlStreering: randomTelemetry()
				};

			}

			break;

		case 'error': // in case we receive an error
			data.shift(); // the first element is "error", we can remove it
			lastErrors.append({ // we append the error to the lastErrors object, which will be transferred to the UI
				severity: data[0],
				element: data[1],
				message: data[2]
			});
			break;

		default: // most likely the data is corrupted
			lastErrors.append({
				severity: 3,
				element: backend,
				message: 'incorrect data received'
			});
			break;
	}
}

ipcMain.on('getTelemetry', event => { // the UI asks for the telemetry
	event.reply('telemetry', lastTelemetry); // we answer with the telemetry
});

ipcMain.on('getErrors', event => { // the UI asks for the errors
	event.reply('errors', lastErrors); // we answer with the errors list
});

app.whenReady().then(() => {
	createMainWindow(); // Create the main window
});