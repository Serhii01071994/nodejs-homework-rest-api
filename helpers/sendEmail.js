const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASS } = process.env;
console.log(`PASSf`, process.env.META_PASS);

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "posttest01071994@meta.ua",
    pass: META_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "posttest01071994@meta.ua" };
  await transport
    .sendMail(email)
    .then(() => console.log("Email send success"))
    .catch((error) => console.log(error.message));
  return true;
};

module.exports = sendEmail;
