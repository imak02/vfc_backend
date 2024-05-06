const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const message = {
    from: `VFC 👻 <${process.env.GMAIL_USER}>`,
    to,
    subject: subject || "VFC ✔",
    text: text || "Hello from VFC",
    html: html || "<b>Hello User,</b>",
  };

  try {
    let info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    // console.log(info);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
