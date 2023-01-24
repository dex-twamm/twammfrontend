const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({
  origin: true,
});

const gmailEmail = process.env.REACT_APP_GMAIL_ID;
const gmailPass = process.env.REACT_APP_GMAIL_PASS;

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    type: "login",
    user: gmailEmail,
    pass: gmailPass,
  },
});

exports.submit = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.end();
  } else {
    cors(req, res, () => {
      if (req.method !== "POST") {
        res.status(400).json({ error: "Method not allowed" });
      }
      console.log("req", req, "res", res);

      const mailOptions = {
        from: "noreply@longswap.com",
        to: "safaladh1999@gmail.com",
        subject: `${req?.body?.name} just messaged me from the website`,
        text: req?.body?.message,
        html: `<p>${req?.body?.message}</p>`,
      };

      return mailTransport.sendMail(mailOptions, (err) => {
        if (err) console.log(err);
        else console.log("Email sent");
      });
    });
  }
});
