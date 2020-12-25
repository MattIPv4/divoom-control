const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
const { sleep } = require('./util');

const CONNECT_MAX_ATTEMPTS = 3;
const CONNECT_ATTEMPT_DELAY = 500;

/**
 * Write a buffer of data to the serial bluetooth connection.
 *
 * @param {Buffer} buffer The data buffer to send.
 * @return {Promise<Buffer>}
 */
module.exports.write = buffer => new Promise((resolve, reject) => {
    btSerial.write(buffer, (err, bytes) => err ? reject(err) : resolve(bytes));
});

/**
 * Connect to the Divoom device.
 *
 * @param {String} address The bluetooth address of the Divoom device.
 * @return {Promise<String>}
 */
module.exports.connect = async address => {
    // Attempt to connect to the device
    const connectAttempt = () => new Promise((resolve, reject) => {
        // Find the device
        btSerial.findSerialPortChannel(address, channel => {
            // Connect to the device
            btSerial.connect(address, channel, function() {
                // Log any data we get from the device
                btSerial.on('data', buffer => {
                    console.log(`[DIVOOM]: ${buffer}`);
                });

                // We connected, resolve
                resolve('Connected');
            }, () => reject('Cannot connect'));
        }, () => reject('Not found'));
    });

    // Track connection attempts
    let attempts = 0;

    // Log a connection attempt
    const log = msg => console.log(`[LOCAL]: Connection ${attempts}/${CONNECT_MAX_ATTEMPTS}: ${msg}`);

    // Let's try connecting
    while (attempts < CONNECT_MAX_ATTEMPTS) {
        try {
            const res = await connectAttempt();
            log(res);
            return res;
        } catch (err) {
            log(err);
            attempts++;
            await sleep(CONNECT_ATTEMPT_DELAY);
        }
    }

    throw new Error('Could not connect');
};

/**
 * Get the name and address of each paired Bluetooth device.
 *
 * @return {Promise<String[]>}
 */
module.exports.getDevices = () => new Promise(resolve => {
    const format = device => `${device.name}: ${device.address.split('-').join(':')}`;
    btSerial.listPairedDevices(data => resolve(data.map(device => format(device))));
});

/**
 * Close the connection to the Bluetooth device.
 */
module.exports.close = () => btSerial.close();
