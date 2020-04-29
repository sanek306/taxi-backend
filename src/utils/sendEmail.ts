import Mailgun from "mailgun-js"
import dotenv from "dotenv";

dotenv.config();

const  mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const sendEmail = (subject: string, html: string, to: string = "sanek306@gmail.com") => {
    const emailData = {
        from: "sanek306@gmail.com",
        to,
        subject,
        html
    };

    return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
    const emailSubject = `Hello ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://google.com/verification/${key}/">here</a>`;
    return sendEmail(emailSubject, emailBody);
};