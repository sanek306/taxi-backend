import { Resolvers } from "src/types/resolvers";
import {EmailSignInMutationArgs, EmailSignUpResponse } from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignUp: async (_, args: EmailSignInMutationArgs) : Promise<EmailSignUpResponse> => {
            const { email } = args;
            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return {
                        ok: false,
                        error: "You should log in instead",
                        token: null
                    }
                }
                else {
                    const { id } = await User.create({ ...args }).save();
                    const token = createJWT(id);
                    return {
                        ok: true,
                        error: null,
                        token
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