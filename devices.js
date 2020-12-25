const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

const getDevices = () => new Promise(resolve => {
    btSerial.listPairedDevices(data => resolve(data));
});

getDevices().then(devices => console.log(devices.map(device => `${device.name}: ${device.address}`)));
