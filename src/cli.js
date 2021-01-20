#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { getDevices, connect, close } = require('./bluetooth');
const { displayColor, displayCustom, setBrightness, displayDateTime, setDateTime, displayImage } = require('./divoom');
const fs = require('fs');

// Define all the CLI commands
const commands = yargs => yargs
    .command('get-devices', 'Listed paired Bluetooth devices', () => {}, async () => {
        const devices = await getDevices();
        console.log(devices.join('\n'));
    })
    .command('display-color', 'Display a static color on the Divoom device.', yargs => {
        yargs.option('address', {
            alias: 'a',
            type: 'string',
            description: 'The Bluetooth address of the Divoom device.'
        }).option('color', {
            alias: 'c',
            type: 'string',
            description: 'The color to set the display to, a hex string.'
        }).option('brightness', {
            alias: 'b',
            type: 'integer',
            description: 'The brightness of the display, ranging 0 - 100.'
        }).demandOption(['a', 'c', 'b']);
    }, async argv => {
        await connect(argv.address);
        await displayColor(argv.color, argv.brightness);
        close();
    })
    .command('display-custom', 'Display the custom channel on the Divoom device.', yargs => {
        yargs.option('address', {
            alias: 'a',
            type: 'string',
            description: 'The Bluetooth address of the Divoom device.'
        }).demandOption(['a']);
    }, async argv => {
        await connect(argv.address);
        await displayCustom();
        close();
    })
    .command('display-date-time', 'Display the date/time channel on the Divoom device.', yargs => {
        yargs.option('address', {
            alias: 'a',
            type: 'string',
            description: 'The Bluetooth address of the Divoom device.'
        }).demandOption(['a']);
    }, async argv => {
        await connect(argv.address);
        await displayDateTime();
        close();
    })
    .command('display-image', 'Display an image on the Divoom device.', yargs => {
        yargs.option('address', {
            alias: 'a',
            type: 'string',
            description: 'The Bluetooth address of the Divoom device.'
        }).option('filename', {
            alias: 'f',
            type: 'string',
            description: 'The file to display. GIF, PNG, BMP or JPG.'
        }).demandOption(['a', 'f']);
    }, async argv => {
        await connect(argv.address);
        await displayImage(fs.realpathSync(argv.filename));
        close();
    })
    .command('set-brightness', 'Set the global brightness of the Divoom device.', yargs => {
        yargs.option('address', {
            alias: 'a',
            type: 'string',
            description: 'The Bluetooth address of the Divoom device.'
        }).option('brightness', {
            alias: 'b',
            type: 'integer',
            description: 'The brightness of the display, ranging 0 - 100.'
        }).demandOption(['a', 'b']);
    }, async argv => {
        await connect(argv.address);
        await setBrightness(argv.brightness);
        close();
    })
    .command('set-date-time', 'Set the date/time of the Divoom device to now.', yargs => {
        yargs.option('address', {
            alias: 'a',
            type: 'string',
            description: 'The Bluetooth address of the Divoom device.'
        }).demandOption(['a']);
    }, async argv => {
        await connect(argv.address);
        await setDateTime();
        close();
    });

// Run the CLI interface
const main = () => commands(yargs(hideBin(process.argv))).argv;

main();
