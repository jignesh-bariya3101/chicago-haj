const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const sgMail = require("@sendgrid/mail");
const config = require("../../config/config");

const sendMail = (toMail, subject, body, fullName, template, ctaLink) => {
  return new Promise((resolve, reject) => {

    sgMail.setApiKey(config.SENDGRID_API_KEY);

    const msg = {
      from: config.EMAIL,
      template_id: template,

      personalizations: [
        {
          to: toMail,
          dynamic_template_data: {
            subject: subject,
            name: fullName,
            email: toMail,
            ctaLink: ctaLink,
          },
        },
      ],
    };

    let sendResult = sgMail.send(msg);

    console.log(sendResult);

    if (sendResult) {
      return resolve(true);
    } else {
      return resolve(false);
    }
  });
};

module.exports = { sendMail };
