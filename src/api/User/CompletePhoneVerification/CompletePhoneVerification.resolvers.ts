import { Resolvers } from "src/types/resolvers";
import {
    CompletePhoneVerificationMutationArgs, CompletePhoneVerificationResponse,
} from "../../../types/graph";
import Verification from "../../../entities/Verification";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";
import {verifySMS} from "../../../utils/sendSMS";

const resolvers: Resolvers = {
    Mutation: {
        CompletePhoneVerification: async (_, args: CompletePhoneVerificationMutationArgs) : Promise<CompletePhoneVerificationResponse> => {
            const { phoneNumber, key } = args;
            try {
                const code: any = await verifySMS(key, phoneNumber);
                const existingVerification = await Verification.findOne({ payload: phoneNumber, key: code });
                if (!existingVerification) {
                    return {
                        ok: false,
                        error: "Verification key not valid",
                        token: null
                    };
                } else {
                    existingVerification.verified = true;
                    await existingVerification.save();
                }

                const user = await User.findOne({phoneNumber});
                if (user) {
                    user.verifiedPhoneNumber = true;
                    await user.save();
                    const token = createJWT(user.id);
                    return {
                        ok: true,
                        error: null,
                        token
                    }
                }
                else {
                     return {
                         ok: true,
                         error: null,
                         token: null
                     }
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