const DIVOOM_ADDRESS = '11:75:58:2d:a8:65';

const { connect } = require('./src/bluetooth');
const { displayColor, displayCustom, setBrightness, displayDateTime, setDateTime } = require('./src/divoom');
const { sleep } = require('./src/util');

const main = async () => {
    await connect(DIVOOM_ADDRESS);

    await displayColor('FF0000', 100);
    await sleep(1000);

    await displayColor('00FF00', 100);
    await sleep(1000);

    await displayColor('0000FF', 100);
    await sleep(1000);

    await displayColor('FFFFFF', 0);
    await sleep(1000);

    await displayColor('FFFFFF', 50);
    await sleep(1000);

    await displayColor('FFFFFF', 100);
    await sleep(1000);

    await displayCustom();
    await sleep(1000);

    await setBrightness(0);
    await sleep(1000);

    await setBrightness(100);
    await sleep(1000);

    await displayDateTime();
    await sleep(1000);

    await setDateTime();

    await displayDateTime();
    await sleep(1000);

    await displayCustom();
};

main();
