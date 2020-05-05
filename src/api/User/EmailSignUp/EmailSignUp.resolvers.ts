import { Resolvers } from "types/resolvers";
import {EmailSignUpResponse, EmailSignUpMutationArgs } from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";
import Verification from "../../../entities/Verification";
import {sendVerificationEmail} from "../../../utils/sendEmail";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignUp: async (_, args: EmailSignUpMutationArgs) : Promise<EmailSignUpResponse> => {
            const { email } = args;
            try {
                const existingUser = await User.findOne({ email });
                console.log(existingUser);
                if (existingUser) {
                    return {
                        ok: false,
                        error: "You should LogIn instead",
                        token: null
                    }
                }
                else {
                    const phoneVerification = await Verification.findOne({
                       payload: args.phoneNumber,
                       verified: true
                    });
                    if (phoneVerification) {
                        const newUser = await User.create({ ...args }).save();
                        const emailVerification = await Verification.create({
                            payload: newUser.email,
                            target: "EMAIL"
                        }).save();
                        await sendVerificationEmail(newUser.fullName, emailVerification.key);
                        const token = createJWT(newUser.id);
                        return {
                            ok: true,
                            error: null,
                            token
                        }
                    }
                    else {
                        return {
                            ok: false,
                            error: "You haven't verified your phone number",
                            token: null
                        }
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