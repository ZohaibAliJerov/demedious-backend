import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
  // initialize nodemailer
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "demediousjobs@gmail.com",
      pass: "demediou7@jobs",
    },
  });

  var mailOptions = {
    from: process.env.USER, // sender address
    to: email, // list of receivers
    subject: subject,
    text: text,
  };

  // trigger the sending of the E-mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
  });
};

export default sendEmail;
