const nodeMailer = require('nodemailer');

module.exports = async (option) => {
  const transporter = await nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PROT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'natours Admin <natours@admin.com>',
    to: option.email,
    subject: option.subject,
    text: option.message,
    // html: '<h1>hello<h1>',
  };

  await transporter.sendMail(mailOptions);
};
