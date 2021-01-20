const Divoom = require('node-divoom-timebox-evo');
const { write } = require('./bluetooth');

/**
 * Display a static color on the Divoom device.
 *
 * @param {String} color The color to set the display to, a hex string.
 * @param {Number} brightness The brightness of the display, ranging 0 - 100.
 *
 * @return {Promise<void>}
 */
module.exports.displayColor = async (color, brightness) => {
    const d = new Divoom.LightningChannel({ color, brightness });
    for (const buffer of d.messages.asBinaryBuffer())
        await write(buffer);
};

/**
 * Display the custom channel on the Divoom device.
 *
 * @return {Promise<void>}
 */
module.exports.displayCustom = async () => {
    const d = new Divoom.CustomChannel();
    for (const buffer of d.messages.asBinaryBuffer())
        await write(buffer);
};

/**
 * Display the date/time channel on the Divoom device.
 *
 * @return {Promise<void>}
 */
module.exports.displayDateTime = async () => {
    const d = new Divoom.TimeChannel({});
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
module.exports.setBrightness = async brightness => {
    const d = new Divoom.BrightnessCommand({ brightness });
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
module.exports.setDateTime = async date => {
    date = date === undefined ? new Date() : date;
    const d = new Divoom.DateTimeCommand({ date });
    for (const buffer of d.messages.asBinaryBuffer())
        await write(buffer);
};


/**
 * Display Image on the Divoom device
 *
 * @param {String} [filename] Filename to read the image from (absolute path)
 *
 * @return {Promise<void>}
 */
module.exports.displayImage = async (filename) => {
    const d = new Divoom.DisplayAnimation();
    const messages = await d.read(filename);

    for (const buffer of messages.asBinaryBuffer())
        await write(buffer);
};
