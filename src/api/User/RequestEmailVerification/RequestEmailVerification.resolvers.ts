import { Resolvers } from "types/resolvers";
import {
    RequestEmailVerificationResponse
} from "../../../types/graph";
import authResolver from "../../../utils/authResolver";
import Verification from "../../../entities/Verification";
import User from "../../../entities/User";
import {sendVerificationEmail} from "../../../utils/sendEmail";

const resolvers: Resolvers = {
    Mutation: {
        RequestEmailVerification: authResolver(async (_, __, { req }) : Promise<RequestEmailVerificationResponse> => {
            const user: User = req.user;
            if (user.email) {
                try {
                    const oldVerification = await Verification.findOne({payload: user.email});
                    if (oldVerification) {
                        await oldVerification.remove();
                    }

                    const newVerification = await Verification.create({
                        payload: user.email,
                        target: "EMAIL"
                    }).save();
                    await sendVerificationEmail(user.fullName, newVerification.key);
                    return {
                        ok: true,
                        error: null
                    }
                }
                catch (e) {
                    return {
                        ok: false,
                        error: e.message
                    }
                }
            }
            else {
                return {
                    ok: false,
                    error: "Your user hasn't email to verifys"
                }
            }
        })
    }
};

export default resolvers;