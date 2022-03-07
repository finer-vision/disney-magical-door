# Disney Magical Door

Server and client for the Disney experiential door event.

### Getting Started

Decrypt `codes.csv` and `guaranteed-win-codes.csv`:

> Note: replace "secret" with passphrases stored in 1Password shared vault,
> under "Disney Magical Door Codes"

```shell
gpg --pinentry-mode=loopback --passphrase "secret" -d data/codes.csv.gpg > data/codes.csv
gpg --pinentry-mode=loopback --passphrase "secret" -d data/guaranteed-win-codes.csv.gpg > data/guaranteed-win-codes.csv
```

Start Project in development mode:

```
# Only on Ubuntu
sudo apt install -y nodejs-legacy build-essential
```

```shell
npm install
npm --prefix server run seed-database
npm start
```

### Arduino UNO Setup

1. [Download Arduino IDE](https://www.arduino.cc/en/software)
2. Connect Arduino to machine
3. Open the Arduino IDE
4. Select: File > Examples > Firmata > StandardFirmataPlus
5. Click "Upload" icon

### Generating QR codes

If you want to generate a QR code image, run this:

```shell
npx --prefix server/ qrcode -w 1024 -o data/g5820f88ggbc21e4.svg g5820f88ggbc21e4
```
