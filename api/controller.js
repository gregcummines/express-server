const rpio = require('rpio');
const r1wt = require('raspi-1wire-temp');
const devices = r1wt.findDevices();

function getTemp() {
    let temp = 0.0;
    if (devices.length > 0) {
        console.log(devices);
        const tempController = r1wt.fromDevice(devices[0]);
        temp = tempController.current.fahrenheit;
    }   
    return temp;
}

module.exports = {
    getTemp: getTemp
};