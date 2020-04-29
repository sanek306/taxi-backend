import { Resolvers } from "types/resolvers";
import {
    StartPhoneVerificationMutationArgs,
    StartPhoneVerificationResponse
} from "../../../types/graph";
import Verification from "../../../entities/Verification";
import {sendVerificationSMS} from "../../../utils/sendSMS";

const resolvers: Resolvers = {
    Mutation: {
        StartPhoneVerification: async (_, args: StartPhoneVerificationMutationArgs) : Promise<StartPhoneVerificationResponse> => {
            const { phoneNumber } = args;
            try {
                const existingVerification = await Verification.findOne({ payload: phoneNumber });
                if (existingVerification) {
                    await existingVerification.remove();
                }
                const newVerification = await Verification.create({
                    payload: phoneNumber,
                    target: "PHONE"
                }).save();

                await sendVerificationSMS(newVerification.payload, newVerification.key);

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