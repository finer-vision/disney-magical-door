const HID = require("node-hid");

// USB relay
const vendorId = 5824;
const productId = 1503;

const deviceInfo = HID.devices((device) => {
  return device.vendorId === vendorId && device.productId === productId;
});

console.log(deviceInfo);

// const devices = HID.devices();
// console.log(devices);
