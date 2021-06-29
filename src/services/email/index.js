import nodemailer from 'nodemailer';

const sendMail = async (receipient, subject, html) => {
  const email = process.env.NODEMAILER_EMAIL;
  const password = process.env.NODEMAILER_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    from: `Farm oasis <${process.env.NODEMAILER_EMAIL}>`,
    to: receipient,
    subject,
    html,
  };

  // eslint-disable-next-line consistent-return
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      return err;
    } if (response) {
      return response;
    }
  });
};

const sendVerificationEmail = async (email, token) => {
  try {
    const receipient = email;
    const subject = 'Welcome to Farm Oasis! Please Confirm Your Email';
    const html = `
            Your confirmation token: ${token}
        `;
    await sendMail(receipient, subject, html);
  } catch (error) {
    throw new Error(error);
  }
};

const sendResetTokenEmail = async (email, token) => {
  try {
    const receipient = email;
    const subject = 'Farm Oasis Password Reset Token';
    const html = `
            Your password reset token: ${token}
        `;
    await sendMail(receipient, subject, html);
  } catch (error) {
    throw new Error(error);
  }
};

export { sendVerificationEmail, sendResetTokenEmail };
