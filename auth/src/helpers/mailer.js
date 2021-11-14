const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shakiryanova.testing@gmail.com',
    pass: 'Fullstack12',
  },
});

async function mailResetPassword(email, link) {
  const mailData = {
    from: 'SALUTE',
    to: email,
    subject: 'Reset Password',
    text: link,
  };

  transporter.sendMail(mailData, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
}

module.exports = { mailResetPassword };
