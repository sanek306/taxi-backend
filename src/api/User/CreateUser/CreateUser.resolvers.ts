import { Resolvers } from "src/types/resolvers";
import {CreateUserMutationArgs, CreateUserResponse} from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        CreateUser: async (_, args: CreateUserMutationArgs) : Promise<CreateUserResponse> => {
            try {
                const newUser = await User.create({
                    ...args,
                    verifiedPhoneNumber: true
                }).save();

                const token = createJWT(newUser.id);
                return {
                    ok: true,
                    error: null,
                    token
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