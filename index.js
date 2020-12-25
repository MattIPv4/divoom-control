const DIVOOM_ADDRESS = '11:75:58:2d:a8:65';
const CONNECT_MAX_ATTEMPTS = 3;
const CONNECT_ATTEMPT_DELAY = 500;

const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
const Divoom = require('node-divoom-timebox-evo');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const write = buffer => new Promise((resolve, reject) => {
    btSerial.write(buffer, (err, bytes) => err ? reject(err) : resolve(bytes));
});

/**
 * Connect to the Divoom device.
 *
 * @return {Promise<String>}
 */
const connect = async () => {
    // Attempt to connect to the device
    const connectAttempt = () => new Promise((resolve, reject) => {
        // Find the device
        btSerial.findSerialPortChannel(DIVOOM_ADDRESS, channel => {
            // Connect to the device
            btSerial.connect(DIVOOM_ADDRESS, channel, function() {
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
 * Set the Divoom device to a static color.
 *
 * @param {Number} brightness The brightness of the display, ranging 0 - 100.
 * @param {String} color The color to set the display to, a hex string.
 *
 * @return {Promise<void>}
 */
const color = async (brightness, color) => {
    const d = new Divoom.LightningChannel({ brightness, color });
    for (const buffer of d.messages.asBinaryBuffer())
        await write(buffer);
};

/**
 * Set the global brightness of the Divoom device.
 *
 * @param {Number} brightness The brightness of the display, ranging 0 - 100.
 *
 * @return {Promise<void>}
 */
const brightness = async brightness => {
    const d = new Divoom.BrightnessCommand({ brightness });
    for (const buffer of d.messages.asBinaryBuffer())
        await write(buffer);
};

/**
 * Set the Divoom device to the custom channel.
 *
 * @return {Promise<void>}
 */
const custom = async () => {
    const d = new Divoom.CustomChannel();
    for (const buffer of d.messages.asBinaryBuffer())
        await write(buffer);
};

/**
 * Set the Divoom device to the date/time channel.
 *
 * @return {Promise<void>}
 */
const dateTime = async () => {
    const d = new Divoom.TimeChannel({});
    for (const buffer of d.messages.asBinaryBuffer())
        await write(buffer);
};

/**
 * Set the date/time of the Divoom device.
 *
 * @param {Date} [date] The new date for the device, defaults to now.
 *
 * @return {Promise<void>}
 */
const setDateTime = async date => {
    date = date === undefined ? new Date() : date;
    const d = new Divoom.DateTimeCommand({ date });
    for (const buffer of d.messages.asBinaryBuffer())
        await write(buffer);
}

const main = async () => {
    await connect();

    await color(100, 'FF0000');
    await sleep(1000);

    await color(100, '00FF00');
    await sleep(1000);

    await color(100, '0000FF');
    await sleep(1000);

    await color(0, 'FFFFFF');
    await sleep(1000);

    await color(50, 'FFFFFF');
    await sleep(1000);

    await color(100, 'FFFFFF');
    await sleep(1000);

    await custom();
    await sleep(1000);

    await brightness(0);
    await sleep(1000);

    await brightness(100);
    await sleep(1000);

    await dateTime();
    await sleep(1000);

    await setDateTime();

    await dateTime();
    await sleep(1000);
};

main();
