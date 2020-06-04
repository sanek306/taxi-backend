// import Twilio from "twilio";
// import dotenv from "dotenv";
//
// dotenv.config();
// const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
//
// export const sendSMS = (to: string, body: string) : Promise<any> => {
//     return twilioClient.messages.create({
//         body,
//         to,
//         from: process.env.TWILIO_PHONE
//     })
// };
//
// export const sendVerificationSMS = (to: string, key: string) =>
//     sendSMS(to, `Your verification key is: ${key}`);

import dotenv from "dotenv";
const { google } = require('googleapis');

dotenv.config();

const identityToolkit = google.identitytoolkit({
    auth: process.env.GOOGLE_API_KEY,
    version: 'v3',
});
export const sessionInfo = {};
export const sendSMS = async (to: string, recaptchaToken: string, key: String) => {
    try {
        const { data } = await identityToolkit.relyingparty.sendVerificationCode({
            phoneNumber: to,
            recaptchaToken
        });
        sessionInfo[to] = {
            sessionInfo: data.sessionInfo,
            key
        };
        return true;
    }
    catch (e) {
        return false;
    }
};

export const verifySMS = async (code: string, phoneNumber: string) => {
    try {
        const { data } = await identityToolkit.relyingparty.verifyPhoneNumber({
            code,
            sessionInfo: sessionInfo[phoneNumber].sessionInfo
        });
        let key = 0;
        if (data) {
            key = sessionInfo[phoneNumber].key;
            delete sessionInfo[phoneNumber];
            return key;
        }
        return key;
    }
    catch (e) {
        return 0;
    }
};