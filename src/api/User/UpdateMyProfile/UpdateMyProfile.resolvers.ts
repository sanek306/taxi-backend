import { Resolvers } from "types/resolvers";
import authResolver from "../../../utils/authResolver";
import {UpdateMyProfileMutationArgs, UpdateMyProfileResponse} from "../../../types/graph";
import User from "../../../entities/User";

const resolvers: Resolvers = {
    Mutation: {
        UpdateMyProfile: authResolver(async (_, args: UpdateMyProfileMutationArgs, { req }) : Promise<UpdateMyProfileResponse> => {
            const user: User = req.user;
            try {
                if (args.password !== null) {
                    user.password = args.password;
                    await user.save();
                }
                await User.update({ id: user.id }, { ...args });
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
        })
    }
};

export default resolvers;