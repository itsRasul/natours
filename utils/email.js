const pug = require('pug');
const htmlToText = require('html-to-text');
// nodemailer is a node.js module that give us ability to send email by one of the services(mailtrap, sendGrid...)
const nodeMailer = require('nodemailer');

// there are some servieses that we can get help from them to ssend email in node.js application
// one of them is mailtrap that is for development envirement, it it doesn't send real email, instead of that it trap the email
// and we can see it on mailtrap
// onother one is sendGrid sevice that give us ability to send real email

// the way of using this class => new Email(user).sendWelcome();
module.exports = class Email {
  constructor(user, url) {
    this.from = `natours company <${process.env.EMAIL_FROM}>`;
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
  }

  // create a transporter object
  newTransport() {
    // in development envirement: we use mailtrap service in order to send fake email
    if (process.env.NODE_ENV === 'development') {
      //transporter is going to be an object that is able to send mail
      //transport is the transport configuration object, connection url or a transport plugin instance
      return nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    // return nodeMailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: '',
    //     pass: '',
    //   },
    // });

    // return nodeMailer.createTransport({
    //   service: 'sendGrid',
    //   auth: {
    //     user: process.env.SENDGRID_USERNAME,
    //     pass: process.env.SENDGRID_PASSWORD,
    //   },
    // });

    // in production envirement; we're gonna use sendGrid service in order to send real email
  }

  async send(template, subject) {
    // send actual email
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) create a trasport
    const transporter = this.newTransport();
    // 3) send email by transport
    await transporter.sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    });
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to our natours family!');
  }

  async resetPassword() {
    await this.send(
      'resetPassword',
      'your reset password token (you have just 10 minutes time)'
    );
  }
};

// module.exports = async (option) => {
//   // trasport: we specify who is gonna send the email, what is host or username and password, ...
//   const transporter = await nodeMailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PROT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: 'natours Admin <natours@admin.com>',
//     to: option.email,
//     subject: option.subject,
//     text: option.message,
//     // html: '<h1>hello<h1>',
//   };

//   await transporter.sendMail(mailOptions);
// };
