const uuid = require("uuid").v4;

const verificationToken = uuid();

const verifyEmail = {
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
};