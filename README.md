# Disney Magical Door

Server and client for the Disney experiential door event.

### Generating Win Times

This will generate random win times for all events and encrypt them into this file `data/win-times.csv.gpg`:

```shell
npm --prefix server/ run generateEncryptedWinTimesCsv
```

### Arduino UNO Setup

1. [Download Arduino IDE](https://www.arduino.cc/en/software)
2. Connect Arduino to machine
3. Open the Arduino IDE
4. Select: File > Examples > Firmata > StandardFirmataPlus
5. Click "Upload" icon

### Getting Started

**Development Software**

- GPG 2+
- Git 2+
- Node 17+
- NPM 8+
- Google Chrome 99+

Start project in development mode:

```
# Only on Ubuntu
sudo chmod 666 /dev/tty*
```

```shell
cp server/env.example.ts server/env.ts
###################################################
# 👆 edit and update variables, then run these 👇 #
###################################################
npm install
npm --prefix server run reset
npm start
```

Start project in production (kiosk) mode:

```shell
cp server/env.example.ts server/env.ts
###################################################
# 👆 edit and update variables, then run these 👇 #
###################################################
npm install
#####################################################################
# 👇 IMPORTANT: ONLY RUN THIS COMMAND ONCE FOR THE INITIAL SETUP 👇 #
#####################################################################
npm run build
npm --prefix server run reset
pm2 start /home/fv/apps/disney-magical-door/ecosystem.config.js
pm2 save
```

### Generating QR Code Images

This will generate 10 random codes + the admin codes:

```shell
npm --prefix server run generateQrCodeImages
```

### Debugging Chrome App

When running the Chrome app, visiting [localhost:9222](http://localhost:9222) will open a debugger
with dev tools and a preview of the running app. This is useful when the app is running, and you want
to inspect the runtime without opening the app's dev tools. Ideally you will do this on-site via the
local IP of the machine running the app, e.g. [192.168.0.2:9222](http://192.168.0.2:9222).

### TODO

- [ ] Automated EOD email to client with winning codes
- [ ] Play sound files when scan is a winner or loser
