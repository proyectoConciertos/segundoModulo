const mailer = require('nodemailer');

const transport = mailer.createTransport({
    service: "Sendgrid",
    auth: {
      user: process.env.SEND_USER,
      pass: process.env.SEND_PASS
    }
  });
  
  exports.send = (options) => {
    const mailOptions = {
      subject: options.subject,
      to: options.email,
      from:`😡 Gus Mail 😡 <noreply@gusano.com>`,
      text: options.message,
      html: `<h1>Tu password es: </h1>`
    }
    return transport.sendMail(mailOptions);
  }
  
  transport.verify(function(error, success) {
    if (error) {
         console.log(error);
    } else {
         console.log('Servidor listo');
    }
  });