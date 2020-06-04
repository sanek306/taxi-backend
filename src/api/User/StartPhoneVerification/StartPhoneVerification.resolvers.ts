import { Resolvers } from "src/types/resolvers";
import {
    StartPhoneVerificationMutationArgs,
    StartPhoneVerificationResponse
} from "../../../types/graph";
import Verification from "../../../entities/Verification";
import {sendSMS} from "../../../utils/sendSMS";

const resolvers: Resolvers = {
    Mutation: {
        StartPhoneVerification: async (_, args: StartPhoneVerificationMutationArgs) : Promise<StartPhoneVerificationResponse> => {
            const { phoneNumber, recaptchaToken } = args;
            try {
                const existingVerification = await Verification.findOne({ payload: phoneNumber });
                if (existingVerification) {
                    await existingVerification.remove();
                }
                const newVerification = await Verification.create({
                    payload: phoneNumber,
                    target: "PHONE"
                }).save();
                await sendSMS(newVerification.payload, recaptchaToken, newVerification.key);

                return {
                    ok: true,
                    error: null,
                    token: null
                }
            } catch (e) {
                return {
                    ok: false,
                    error: e.message,
                    token: null
                }
            }
        }
    }
};

export default resolvers;