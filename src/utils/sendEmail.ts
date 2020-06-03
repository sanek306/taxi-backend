import Mailgun from "mailgun-js"
import dotenv from "dotenv";

dotenv.config();

const  mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const sendEmail = (subject: string, html: string, to: string = "16itzt2.puhachou.a@pdu.by") => {
    const emailData = {
        from: "16itzt2.puhachou.a@pdu.by",
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