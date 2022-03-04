# Disney Magical Door

Brain and client for the Disney experiential door event.

### Getting Started

Unlock `codes.csv`:

> Replace `secret` passphrase with the actual password (stored in Finer Vision's 1Password vault).

```shell
gpg --pinentry-mode=loopback --passphrase "secret" -d data/codes.csv.gpg > data/codes.csv
```

Start Project in development mode:

```shell
npm install
npm start
```

### Arduino UNO Setup

1. [Download Arduino IDE](https://www.arduino.cc/en/software)
2. Connect Arduino to machine
3. Open the Arduino IDE
4. Select: File > Examples > Firmata > StandardFirmataPlus
5. Click "Upload" icon
