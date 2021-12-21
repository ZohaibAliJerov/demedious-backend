import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
  // try {
  //   const transporter = nodemailer.createTransport({
  //     service: process.env.SERVICE,
  //     auth: {
  //       user: process.env.USER,
  //       pass: process.env.PASS,
  //     },
  //   });

  //   transporter.sendMail(
  //     {
  //       from: process.env.USER,
  //       to: email,
  //       subject: subject,
  //       text: text,
  //     },
  //     (err, info) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log(info);
  //       }
  //     }
  //   );
  // } catch (error) {
  //   console.log(error, "email not sent");
  // }

  // initialize nodemailer
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "demediousjobs@gmail.com",
      pass: "demediou7@jobs",
    },
  });

  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("./views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views/"),
  };

  // use a template file with nodemailer
  transporter.use("compile", hbs(handlebarOptions));

  var mailOptions = {
    from: procesll.env.USER, // sender address
    to: email, // list of receivers
    subject: "",
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
