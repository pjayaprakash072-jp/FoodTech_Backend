const nodemailer = require("nodemailer");
const dotenv = require('dotenv')

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, message) => {
    await transporter.sendMail({
        from: process.env.EMAIL_NO_REPLAY,
        to: to,
        subject: subject,
        text: message
    });
};

module.exports = sendEmail;