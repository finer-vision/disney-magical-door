import * as Email from "email-templates";
import config from "../config";

const email = new Email({
  transport: config.email.transport,
  preview: config.email.preview,
  send: config.email.send,
  message: {
    from: config.email.from,
  },
});

export default email;
