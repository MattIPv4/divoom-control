# divoom-control

A little Node.js project to control Divoom devices, specifically the Pixoo that I have in my office.

It has a CLI, as well as exported functions that can be accessed programmatically.

```text
Commands:
  divoom-control get-devices        Listed paired Bluetooth devices (note: does not work on linux)
  divoom-control display-color      Display a static color on the Divoom device.
  divoom-control display-custom     Display the custom channel on the Divoom device.
  divoom-control display-date-time  Display the date/time channel on the Divoom device.
  divoom-control display-image      Display image on the Divoom device (supports JPG, PNG, BMP and GIF incl. animation)
  divoom-control set-brightness     Set the global brightness of the Divoom device.
  divoom-control set-date-time      Set the date/time of the Divoom device to now.
```

## Setup (Linux)

    sudo apt install nodejs npm
    sudo apt install build-essential libbluetooth-dev
    npm ci
    node src/cli.js display-color -a XX:XX:XX:XX:XX:XX -c ff0000 -b 100
