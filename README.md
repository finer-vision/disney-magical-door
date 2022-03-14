# Disney Magical Door

Server and client for the Disney experiential door event.

### Arduino UNO Setup

1. [Download Arduino IDE](https://www.arduino.cc/en/software)
2. Connect Arduino to machine
3. Open the Arduino IDE
4. Select: File > Examples > Firmata > StandardFirmataPlus
5. Click "Upload" icon

### Software Requirements

- GPG 2+
- Git 2+
- Node 17+
- NPM 8+
- Google Chrome 99+

### Getting Started Development

```shell
cp server/env.example.ts server/env.ts
###################################################
# 👆 edit and update variables, then run these 👇 #
###################################################
npm install
npm --prefix server run reset
npm start
```

### Kiosk Install

These commands will make the kiosk machine plug 'n' play.

```shell
sudo chmod 666 /dev/tty*
cp server/env.example.ts server/env.ts
###################################################
# 👆 edit and update variables, then run these 👇 #
###################################################
npm install
npm run build
#######################################################################
# 👇 IMPORTANT: ONLY RUN THESE COMMANDS ONCE FOR THE INITIAL SETUP 👇 #
#######################################################################
npm --prefix server run reset
pm2 start /home/fv/apps/disney-magical-door/ecosystem.config.js
pm2 save
```

### Generating Win Times

This will generate random win times for all events and encrypt them into this file `data/win-times.csv.gpg`:

```shell
npm --prefix server/ run generateEncryptedWinTimesCsv
```

### Generating QR Code Images

This will generate 10 random codes + the admin codes.

```shell
npm --prefix server run generateQrCodeImages
```

### Debugging Chrome App

When running the Chrome app, visiting [localhost:9222](http://localhost:9222) will open a debugger
with dev tools and a preview of the running app. This is useful when the app is running, and you want
to inspect the runtime without opening the app's dev tools. Ideally you will do this on-site via the
local IP of the machine running the app, e.g. [192.168.0.2:9222](http://192.168.0.2:9222).

### TODO

- [ ] Play sound files when scan is a winner or loser
