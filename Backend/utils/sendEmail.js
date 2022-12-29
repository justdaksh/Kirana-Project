const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        port: process.env.SMPT_PORT,
        host:process.env.SMPT_HOST,
        secure: true,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        },
        tls: {
            rejectUnAuthorized:true
        }
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
        
    };

    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;