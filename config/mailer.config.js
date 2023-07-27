const nodemailer = require('nodemailer');

const email = process.env.EMAIL_ACCOUNT;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: email,
        pass: process.env.EMAIL_PASSWORD,
    }
});

module.exports.sendValidationEmail = (user) => {
    transporter.sendMail({
        from: `Test <${email}>`,
        to: user.email,
        subject: 'This is a test for ironhack exercise',
        html: `
            <h1> Hello. </h1>

            <p> Please click here to activate your account </p>

            <a href='${process.env.APP_HOST}/users/${user.id}/activate'>Click here</a>

        `
    })
    .then(() => {
        console.log(`Email sent to ${user.id}`)
    })
    .catch((err)=> {
        console.error('error sending mail', err)
    })
};